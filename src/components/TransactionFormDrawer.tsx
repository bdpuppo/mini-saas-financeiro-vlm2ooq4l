import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
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
import useFinanceStore, { TransactionType, Transaction } from '@/stores/useFinanceStore'
import { toast } from '@/hooks/use-toast'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: TransactionType | 'all'
  editItem?: Transaction | null
}

export function TransactionFormDrawer({
  open,
  onOpenChange,
  defaultType = 'all',
  editItem,
}: Props) {
  const { addTransaction, updateTransaction } = useFinanceStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [type, setType] = useState<TransactionType>(defaultType === 'all' ? 'saida' : defaultType)
  const [status, setStatus] = useState('previsto')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [entity, setEntity] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    if (editItem) {
      setType(editItem.type)
      setStatus(
        editItem.status === 'recebido' || editItem.status === 'pago' ? 'realizado' : 'previsto',
      )
      setDate(editItem.date)
      setAmount(editItem.amount.toString())
      setEntity(editItem.entity)
      setDescription(editItem.description || '')
      setCategory(editItem.category || '')
    } else if (open) {
      setDate(new Date().toISOString().split('T')[0])
      setAmount('')
      setEntity('')
      setDescription('')
      setCategory('')
      setStatus('previsto')
      setType(defaultType === 'all' ? 'saida' : defaultType)
    }
  }, [editItem, open, defaultType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !amount || !entity || !category) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    const payload = {
      type,
      status,
      date,
      amount: parseFloat(amount),
      entity,
      description,
      category,
    }

    try {
      if (editItem) {
        await updateTransaction(editItem.id, payload, editItem.rawSource)
        toast({ title: 'Sucesso', description: 'Lançamento atualizado com sucesso!' })
      } else {
        await addTransaction(payload)
        toast({ title: 'Sucesso', description: 'Lançamento adicionado com sucesso!' })
      }
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar. Verifique sua conexão.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[425px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editItem ? 'Editar Lançamento' : 'Novo Lançamento'}</SheetTitle>
          <SheetDescription>
            {editItem
              ? 'Atualize as informações do lançamento.'
              : 'Adicione uma nova conta ao sistema.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select
                value={type}
                onValueChange={(val) => setType(val as TransactionType)}
                disabled={!!editItem}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada (Receber)</SelectItem>
                  <SelectItem value="saida">Saída (Pagar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previsto">Previsto</SelectItem>
                  <SelectItem value="realizado">Realizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Data</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Entidade</Label>
            <Input
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              placeholder="Cliente ou fornecedor"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve detalhamento"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Nome da Categoria"
              required
            />
          </div>

          <SheetFooter className="mt-8">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Lançamento'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
