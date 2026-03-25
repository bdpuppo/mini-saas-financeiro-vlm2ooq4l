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
import { CheckCircle, Lightbulb, Pencil } from 'lucide-react'
import { Transaction } from '@/stores/useFinanceStore'
import { formatCurrency, formatDate } from '@/utils/formatters'
import useFinanceStore from '@/stores/useFinanceStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Props {
  transactions: Transaction[]
  onEdit?: (tx: Transaction) => void
  isLoading?: boolean
}

export function TransactionTable({ transactions, onEdit, isLoading }: Props) {
  const { updateTransactionStatus, toggleSkip } = useFinanceStore()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(transactions.map((t) => t.id)) : new Set())
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) newSelected.add(id)
    else newSelected.delete(id)
    setSelectedIds(newSelected)
  }

  const handleMarkAsRealizado = () => {
    if (selectedIds.size === 0) return
    selectedIds.forEach((id) => {
      const tx = transactions.find((t) => t.id === id)
      if (tx) updateTransactionStatus(id, 'realizado', tx.rawSource)
    })
    setSelectedIds(new Set())
    toast.success(`${selectedIds.size} lançamentos marcados como Realizado.`)
  }

  return (
    <div className="space-y-4">
      {selectedIds.size > 0 && (
        <div className="bg-slate-100 p-3 rounded-md flex items-center justify-between border border-slate-200 animate-in fade-in">
          <span className="text-sm font-medium text-slate-700">
            {selectedIds.size} item(s) selecionado(s)
          </span>
          <Button
            size="sm"
            onClick={handleMarkAsRealizado}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar Realizado
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
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                  Carregando lançamentos...
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              transactions.map((tx) => {
                const isDone =
                  tx.status === 'realizado' || tx.status === 'pago' || tx.status === 'recebido'
                return (
                  <TableRow key={tx.id} className="hover:bg-slate-50/70 transition-colors group">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(tx.id)}
                        onCheckedChange={(c) => handleSelectOne(tx.id, !!c)}
                        disabled={tx.rawSource === 'ft'}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">
                      {formatDate(tx.date)}
                    </TableCell>
                    <TableCell className="font-medium">{tx.entity}</TableCell>
                    <TableCell
                      className="text-slate-600 max-w-[200px] truncate"
                      title={tx.description}
                    >
                      {tx.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          updateTransactionStatus(
                            tx.id,
                            isDone ? 'previsto' : 'realizado',
                            tx.rawSource,
                          )
                        }
                        disabled={tx.rawSource === 'ft'}
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors inline-flex items-center',
                          tx.rawSource === 'ft' && 'opacity-80 cursor-default',
                          isDone
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
                        )}
                      >
                        {tx.status.toUpperCase()}
                      </button>
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-mono font-medium',
                        tx.type === 'entrada' ? 'text-green-600' : 'text-red-600',
                      )}
                    >
                      {tx.type === 'entrada' ? '+' : '-'}
                      {formatCurrency(Number(tx.amount))}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {Number(tx.amount) > 1000 && !isDone && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-yellow-600 hover:bg-yellow-50"
                            onClick={toggleSkip}
                            title="Sugestões do SKIP"
                          >
                            <Lightbulb className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-slate-900"
                          onClick={() => onEdit?.(tx)}
                          title="Editar lançamento"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            {!isLoading && transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                  Nenhum lançamento encontrado para os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
