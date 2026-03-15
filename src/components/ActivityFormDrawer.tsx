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
import useFinanceStore, { Activity, ActivityStatus } from '@/stores/useFinanceStore'
import { toast } from '@/hooks/use-toast'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  editItem?: Activity | null
}

export function ActivityFormDrawer({ open, onOpenChange, editItem }: Props) {
  const { addActivity, updateActivity } = useFinanceStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [date, setDate] = useState('')
  const [title, setTitle] = useState('')
  const [responsible, setResponsible] = useState('')
  const [status, setStatus] = useState<ActivityStatus>('Aguardando')
  const [percentage, setPercentage] = useState('0')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (editItem) {
      setDate(editItem.activity_date)
      setTitle(editItem.title)
      setResponsible(editItem.responsible || '')
      setStatus(editItem.status)
      setPercentage((editItem.percentage || 0).toString())
      setNotes(editItem.notes || '')
    } else if (open) {
      setDate(new Date().toISOString().split('T')[0])
      setTitle('')
      setResponsible('')
      setStatus('Aguardando')
      setPercentage('0')
      setNotes('')
    }
  }, [editItem, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !title) {
      toast({
        title: 'Erro',
        description: 'Data e Título são obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    const payload: Partial<Activity> = {
      activity_date: date,
      title,
      responsible,
      status,
      percentage: Number(percentage),
      notes,
    }

    try {
      if (editItem) {
        await updateActivity(editItem.id, payload)
        // Toast is handled in store
      } else {
        await addActivity(payload)
        toast({ title: 'Sucesso', description: 'Atividade criada com sucesso!' })
      }
      onOpenChange(false)
    } catch (error) {
      // Error is handled in store
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[425px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editItem ? 'Editar Atividade' : 'Nova Atividade'}</SheetTitle>
          <SheetDescription>
            {editItem
              ? 'Atualize os dados da atividade.'
              : 'Adicione uma nova tarefa ao acompanhamento.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="space-y-1.5">
            <Label>Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Descrição da tarefa"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Responsável</Label>
              <Input
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Nome"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as ActivityStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OK">OK</SelectItem>
                  <SelectItem value="Andamento">Andamento</SelectItem>
                  <SelectItem value="Aguardando">Aguardando</SelectItem>
                  <SelectItem value="Parado">Parado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Progresso (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Notas</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações adicionais..."
            />
          </div>

          <SheetFooter className="mt-8">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Atividade'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
