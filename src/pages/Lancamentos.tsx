import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useFinanceStore, { Transaction } from '@/stores/useFinanceStore'
import { TransactionTable } from '@/components/TransactionTable'
import { TransactionFormDrawer } from '@/components/TransactionFormDrawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'

const getWeekOfMonth = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00')
  return Math.ceil(d.getDate() / 7).toString()
}

export default function Lancamentos() {
  const location = useLocation()
  const { transactions } = useFinanceStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editTx, setEditTx] = useState<Transaction | null>(null)

  const [catFilter, setCatFilter] = useState('all')
  const [entFilter, setEntFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [weekFilter, setWeekFilter] = useState('all')

  const filterType = location.pathname.includes('receber')
    ? 'entrada'
    : location.pathname.includes('pagar')
      ? 'saida'
      : 'all'

  const filteredTransactions = useMemo(() => {
    let txs = transactions
    if (filterType !== 'all') txs = txs.filter((t) => t.type === filterType)
    if (catFilter !== 'all') txs = txs.filter((t) => t.category === catFilter)
    if (entFilter) txs = txs.filter((t) => t.entity.toLowerCase().includes(entFilter.toLowerCase()))
    if (statusFilter !== 'all') txs = txs.filter((t) => t.status === statusFilter)
    if (weekFilter !== 'all') txs = txs.filter((t) => getWeekOfMonth(t.date) === weekFilter)

    return [...txs].sort((a, b) => b.date.localeCompare(a.date))
  }, [transactions, filterType, catFilter, entFilter, statusFilter, weekFilter])

  const titles = {
    all: 'Todos Lançamentos',
    entrada: 'Contas a Receber',
    saida: 'Contas a Pagar',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{titles[filterType]}</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie suas transações e acompanhe os status.
          </p>
        </div>
        <Button onClick={() => setIsDrawerOpen(true)} className="bg-primary shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Lançamento
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
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
              <SelectItem value="Impostos">Impostos</SelectItem>
              <SelectItem value="Fornecedor">Fornecedor</SelectItem>
              <SelectItem value="RH">RH / Folha</SelectItem>
              <SelectItem value="Frete">Frete</SelectItem>
              <SelectItem value="Vendas">Vendas</SelectItem>
              <SelectItem value="Outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Entidade
          </Label>
          <Input
            className="h-9 bg-white"
            placeholder="Buscar cliente/fornecedor"
            value={entFilter}
            onChange={(e) => setEntFilter(e.target.value)}
          />
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
              <SelectItem value="realizado">Realizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Semana do Mês
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

      <TransactionTable transactions={filteredTransactions} onEdit={setEditTx} />

      <TransactionFormDrawer
        open={isDrawerOpen || !!editTx}
        onOpenChange={(val) => {
          setIsDrawerOpen(val)
          if (!val) setEditTx(null)
        }}
        defaultType={filterType}
        editItem={editTx}
      />
    </div>
  )
}
