import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { toast } from 'sonner'
import useFinanceStore from '@/stores/useFinanceStore'
import { Loader2 } from 'lucide-react'

export function VoiceEntryFormModal({ open, onOpenChange, initialData }: any) {
  const { addActivity } = useFinanceStore()
  const [descricao, setDescricao] = useState(initialData?.descricao || '')
  const [status, setStatus] = useState(initialData?.status || 'Aguardando')
  const [responsavel, setResponsavel] = useState(initialData?.responsavel || '')
  const [data, setData] = useState(initialData?.data || new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && initialData) {
      setDescricao(initialData.descricao || '')
      setStatus(initialData.status || 'Aguardando')
      setResponsavel(initialData.responsavel || '')
      setData(initialData.data || new Date().toISOString().split('T')[0])
    }
  }, [open, initialData])

  const handleSave = async () => {
    setLoading(true)
    try {
      await addActivity({
        title: descricao,
        activity_date: data,
        status: status,
        responsible: responsavel,
      })

      toast.success('Entrada por voz registrada e processada.')
      onOpenChange(false)
    } catch (e) {
      toast.error('Falha ao salvar a entrada por voz.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Revisar Entrada por Voz (Atividade)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OK">OK</SelectItem>
                  <SelectItem value="Andamento">Andamento</SelectItem>
                  <SelectItem value="Aguardando">Aguardando</SelectItem>
                  <SelectItem value="Parado">Parado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Responsável</Label>
            <Input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar e Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
