import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import useFinanceStore from '@/stores/useFinanceStore'
import { Loader2 } from 'lucide-react'

export function VoiceEntryFormModal({ open, onOpenChange, initialData }: any) {
  const { addActivity, addTransaction } = useFinanceStore()
  const [type, setType] = useState(initialData?.type || 'lançamento')
  const [amount, setAmount] = useState(initialData?.amount || '')
  const [category, setCategory] = useState(initialData?.category || '')
  const [dateStr, setDateStr] = useState(
    initialData?.dateStr || new Date().toISOString().split('T')[0],
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && initialData) {
      setType(initialData.type || 'lançamento')
      setAmount(initialData.amount || '')
      setCategory(initialData.category || '')
      setDateStr(initialData.dateStr || new Date().toISOString().split('T')[0])
    }
  }, [open, initialData])

  const handleSave = async () => {
    setLoading(true)
    try {
      const contentData = JSON.stringify({ amount, category, dateStr })

      await addActivity({
        type: type,
        content: contentData,
        title: `Voz: ${type} - ${category} - R$ ${amount}`,
        activity_date: dateStr,
        status: 'OK',
        notes: 'Gerado via comando de voz',
      })

      // If it's explicitly a financial transaction, we also add it to lancamentos
      if (type.toLowerCase() === 'lançamento') {
        await addTransaction({
          date: dateStr,
          amount: Math.abs(Number(amount) || 0),
          category: category,
          description: `Voz: ${category}`,
          entity: 'Entrada Voz',
          status: 'realizado',
          type: 'saida',
        })
      }

      toast({ title: 'Sucesso', description: 'Entrada por voz registrada e processada.' })
      onOpenChange(false)
    } catch (e) {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar a entrada por voz.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Revisar Entrada por Voz</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipo Reconhecido</Label>
            <Input value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Valor Extraído (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Categoria Identificada</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Data Aplicada</Label>
            <Input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
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
