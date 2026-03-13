import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { CheckCircle, Lightbulb } from 'lucide-react'
import { Transaction } from '@/stores/useFinanceStore'
import { formatCurrency, formatDate } from '@/utils/formatters'
import useFinanceStore from '@/stores/useFinanceStore'
import { toast } from '@/hooks/use-toast'

interface Props {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: Props) {
  const { updateTransactionStatus, toggleSkip } = useFinanceStore()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(transactions.map((t) => t.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) newSelected.add(id)
    else newSelected.delete(id)
    setSelectedIds(newSelected)
  }

  const handleMarkAsRealizado = () => {
    if (selectedIds.size === 0) return
    selectedIds.forEach((id) => updateTransactionStatus(id, 'realizado'))
    setSelectedIds(new Set())
    toast({
      title: 'Atualização em Lote',
      description: `${selectedIds.size} lançamentos marcados como Realizado.`,
    })
  }

  const handleRowClick = (tx: Transaction) => {
    if (tx.amount > 1000 && tx.status === 'previsto') {
      toggleSkip()
    }
  }

  return (
    <div className="space-y-4">
      {selectedIds.size > 0 && (
        <div className="bg-slate-100 p-3 rounded-md flex items-center justify-between border border-slate-200 animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium text-slate-700">
            {selectedIds.size} item(s) selecionado(s)
          </span>
          <Button
            size="sm"
            onClick={handleMarkAsRealizado}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar como Realizado / Pago
          </Button>
        </div>
      )}

      <div className="rounded-md border bg-white shadow-subtle overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedIds.size === transactions.length && transactions.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Entidade</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow
                key={tx.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors group"
                onClick={() => handleRowClick(tx)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(tx.id)}
                    onCheckedChange={(c) => handleSelectOne(tx.id, !!c)}
                  />
                </TableCell>
                <TableCell className="font-medium">{formatDate(tx.date)}</TableCell>
                <TableCell>{tx.entity}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-100 font-normal">
                    {tx.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={tx.status === 'realizado' ? 'default' : 'secondary'}
                    className={
                      tx.status === 'realizado'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : ''
                    }
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell
                  className={`text-right font-mono font-medium ${tx.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {tx.type === 'entrada' ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </TableCell>
                <TableCell>
                  {tx.amount > 1000 && tx.status === 'previsto' && (
                    <div title="Clique para ver sugestões do SKIP">
                      <Lightbulb className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                  Nenhum lançamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
