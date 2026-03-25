import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useFinanceStore, { Transaction } from '@/stores/useFinanceStore'
import { TransactionTable } from '@/components/TransactionTable'
import { TransactionFormDrawer } from '@/components/TransactionFormDrawer'
import { ImportCSVModal } from '@/components/ImportCSVModal'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Mic, Plus } from 'lucide-react'
import { normalizeString } from '@/utils/formatters'
import { toast } from 'sonner'

const getWeekOfMonth = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return Math.ceil(d.getDate() / 7).toString()
}

export default function Lancamentos() {
  const location = useLocation()
  const {
    transactionsFT,
    transactionsAP,
    transactionsAR,
    isLoading,
    categories,
    counterparties,
    costCenters,
    addTransaction,
    fetchData,
  } = useFinanceStore()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editTx, setEditTx] = useState<Transaction | null>(null)
  const [startVoiceRecording, setStartVoiceRecording] = useState(false)

  const [catFilter, setCatFilter] = useState('all')
  const [entFilter, setEntFilter] = useState('all')
  const [ccFilter, setCcFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [weekFilter, setWeekFilter] = useState('all')

  const filterType = location.pathname.includes('receber')
    ? 'entrada'
    : location.pathname.includes('pagar')
      ? 'saida'
      : 'all'

  const uniqueCategories = useMemo(() => {
    const map = new Map<string, string>()
    categories.forEach((c) => {
      const norm = normalizeString(c.name)
      if (norm && !map.has(norm)) map.set(norm, c.name.trim())
    })
    return Array.from(map.values())
  }, [categories])

  const uniqueCounterparties = useMemo(() => {
    const map = new Map<string, string>()
    counterparties.forEach((c) => {
      const norm = normalizeString(c.name)
      if (norm && !map.has(norm)) map.set(norm, c.name.trim())
    })
    return Array.from(map.values())
  }, [counterparties])

  const uniqueCostCenters = useMemo(() => {
    const map = new Map<string, string>()
    costCenters.forEach((c) => {
      const norm = normalizeString(c.name)
      if (norm && !map.has(norm)) map.set(norm, c.name.trim())
    })
    return Array.from(map.values())
  }, [costCenters])

  const filteredTransactions = useMemo(() => {
    let txs: Transaction[] = []
    if (filterType === 'all') txs = transactionsFT
    else if (filterType === 'entrada') txs = transactionsAR
    else if (filterType === 'saida') txs = transactionsAP

    if (catFilter !== 'all') {
      const normFilter = normalizeString(catFilter)
      txs = txs.filter((t) => normalizeString(t.category) === normFilter)
    }
    if (entFilter !== 'all') {
      const normFilter = normalizeString(entFilter)
      txs = txs.filter((t) => normalizeString(t.entity) === normFilter)
    }
    if (ccFilter !== 'all') {
      const normFilter = normalizeString(ccFilter)
      txs = txs.filter((t) => normalizeString(t.costCenter) === normFilter)
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'realizado')
        txs = txs.filter((t) => ['realizado', 'pago', 'recebido'].includes(t.status?.toLowerCase()))
      else if (statusFilter === 'previsto')
        txs = txs.filter((t) => t.status?.toLowerCase() === 'previsto')
    }

    if (weekFilter !== 'all') {
      txs = txs.filter((t) => getWeekOfMonth(t.date) === weekFilter)
    }

    return [...txs].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  }, [
    transactionsFT,
    transactionsAR,
    transactionsAP,
    filterType,
    catFilter,
    entFilter,
    ccFilter,
    statusFilter,
    weekFilter,
  ])

  const handleImport = async (data: any[]) => {
    let successCount = 0
    let errorCount = 0
    const batch = data.slice(0, 500)

    for (let i = 0; i < batch.length; i++) {
      const row = batch[i]
      try {
        let type =
          filterType === 'entrada'
            ? 'entrada'
            : filterType === 'saida'
              ? 'saida'
              : row.tipo?.toLowerCase() || (Number(row.valor) >= 0 ? 'entrada' : 'saida')

        let status =
          filterType === 'all'
            ? row.status === 'realizado'
              ? 'realizado'
              : 'previsto'
            : row.status || 'previsto'

        let entity =
          filterType === 'entrada'
            ? row.cliente
            : filterType === 'saida'
              ? row.favorecido
              : row.cliente || row.favorecido || row.descricao || 'Desconhecido'

        if (!row.data || row.valor === undefined) {
          throw new Error('Campos obrigatórios ausentes')
        }

        await addTransaction(
          {
            date: row.data || new Date().toISOString().split('T')[0],
            amount: Math.abs(Number(row.valor)) || 0,
            category: row.categoria || 'Geral',
            description: row.descricao || '',
            entity: entity || 'Desconhecido',
            status: status,
            type: type,
          },
          true,
        )
        successCount++
      } catch (err) {
        errorCount++
        toast.error(`Linha ${i + 1}: ${err instanceof Error ? err.message : 'Erro na importação'}`)
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount}/${batch.length} registros importados com sucesso!`)
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} registros falharam durante a importação.`)
    }

    await fetchData(true)
  }

  const titles = {
    all: 'Lançamentos (Histórico)',
    entrada: 'Contas a Receber',
    saida: 'Contas a Pagar',
  }

  const isSpeechSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{titles[filterType]}</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie suas transações e acompanhe os status.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ImportCSVModal onImport={handleImport} modelType={filterType} />

          {isSpeechSupported && (
            <Button
              variant="outline"
              onClick={() => {
                setStartVoiceRecording(true)
                setIsDrawerOpen(true)
              }}
              disabled={isLoading}
              className="text-primary hover:bg-primary/5 hover:text-primary border-primary/20"
            >
              <Mic className="h-4 w-4 mr-2" />
              Por Voz
            </Button>
          )}
          <Button
            onClick={() => {
              setStartVoiceRecording(false)
              setIsDrawerOpen(true)
            }}
            className="bg-primary shadow-sm"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Lançamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Categoria
          </Label>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="h-9 bg-white">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {uniqueCategories.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Entidade
          </Label>
          <Select value={entFilter} onValueChange={setEntFilter}>
            <SelectTrigger className="h-9 bg-white">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {uniqueCounterparties.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            C. de Custo
          </Label>
          <Select value={ccFilter} onValueChange={setCcFilter}>
            <SelectTrigger className="h-9 bg-white">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueCostCenters.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Status
          </Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 bg-white">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="previsto">Previsto</SelectItem>
              <SelectItem value="realizado">Realizado / Pago</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Semana
          </Label>
          <Select value={weekFilter} onValueChange={setWeekFilter}>
            <SelectTrigger className="h-9 bg-white">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="1">Semana 1</SelectItem>
              <SelectItem value="2">Semana 2</SelectItem>
              <SelectItem value="3">Semana 3</SelectItem>
              <SelectItem value="4">Semana 4</SelectItem>
              <SelectItem value="5">Semana 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TransactionTable
        transactions={filteredTransactions}
        onEdit={setEditTx}
        isLoading={isLoading}
      />

      <TransactionFormDrawer
        open={isDrawerOpen || !!editTx}
        onOpenChange={(val) => {
          setIsDrawerOpen(val)
          if (!val) {
            setEditTx(null)
            setStartVoiceRecording(false)
          }
        }}
        defaultType={filterType}
        editItem={editTx}
        startVoiceRecording={startVoiceRecording}
      />
    </div>
  )
}
