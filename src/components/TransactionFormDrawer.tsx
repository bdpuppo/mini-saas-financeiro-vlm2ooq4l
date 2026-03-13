import { useState } from 'react'
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
import useFinanceStore, { TransactionType, TransactionStatus } from '@/stores/useFinanceStore'
import { toast } from '@/hooks/use-toast'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: TransactionType | 'all'
}

export function TransactionFormDrawer({ open, onOpenChange, defaultType = 'all' }: Props) {
  const { addTransaction } = useFinanceStore()

  const [type, setType] = useState<TransactionType>(defaultType === 'all' ? 'saida' : defaultType)
  const [status, setStatus] = useState<TransactionStatus>('previsto')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [entity, setEntity] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !amount || !entity || !category) {
      toast({
        title: 'Erro de Validação',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    addTransaction({
      id: Math.random().toString(36).substring(7),
      type,
      status,
      date,
      amount: parseFloat(amount),
      entity,
      description,
      category,
    })

    toast({
      title: 'Sucesso',
      description: 'Lançamento adicionado com sucesso!',
    })

    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setDate('')
    setAmount('')
    setEntity('')
    setDescription('')
    setCategory('')
    setStatus('previsto')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[425px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Novo Lançamento</SheetTitle>
          <SheetDescription>
            Adicione uma nova conta a pagar ou receber ao sistema.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(val) => setType(val as TransactionType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada (Receber)</SelectItem>
                  <SelectItem value="saida">Saída (Pagar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Natureza</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as TransactionStatus)}>
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
            <div className="space-y-2">
              <Label>Data / Vencimento</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
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

          <div className="space-y-2">
            <Label>Entidade (Cliente/Fornecedor)</Label>
            <Input
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              placeholder="Nome da empresa ou pessoa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve detalhamento"
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Impostos">Impostos</SelectItem>
                <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                <SelectItem value="RH">RH / Folha</SelectItem>
                <SelectItem value="Frete">Frete</SelectItem>
                <SelectItem value="Vendas">Vendas</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="mt-8">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Lançamento</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
