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
import { Mic, MicOff } from 'lucide-react'
import useFinanceStore, { TransactionType, Transaction } from '@/stores/useFinanceStore'
import { useSpeechRecognition } from '@/hooks/use-speech'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: TransactionType | 'all'
  editItem?: Transaction | null
  startVoiceRecording?: boolean
}

function parseTranscript(text: string) {
  let amount = ''
  let description = text
  let dateStr = ''
  let category = ''

  const amountRegex =
    /(?:R\$\s*|reais\s*)?(\d{1,3}(?:\.\d{3})*(?:,\d+)?|\d+(?:,\d+)?)\s*(?:reais|centavos)?/i
  const match = text.match(amountRegex)
  if (match) {
    const rawAmount = match[1].replace(/\./g, '').replace(',', '.')
    amount = parseFloat(rawAmount).toString()
    description = description.replace(match[0], '').trim()
  }

  const tLower = text.toLowerCase()
  const d = new Date()
  if (tLower.includes('ontem')) {
    d.setDate(d.getDate() - 1)
    dateStr = d.toISOString().split('T')[0]
    description = description.replace(/ontem/i, '').trim()
  } else if (tLower.includes('amanhã') || tLower.includes('amanha')) {
    d.setDate(d.getDate() + 1)
    dateStr = d.toISOString().split('T')[0]
    description = description.replace(/amanhã|amanha/i, '').trim()
  } else if (tLower.includes('hoje')) {
    dateStr = d.toISOString().split('T')[0]
    description = description.replace(/hoje/i, '').trim()
  }

  const catMatch = description.match(/categoria\s+([a-zA-ZÀ-ÿ\s]+)/i)
  if (catMatch) {
    category = catMatch[1].trim()
    description = description.replace(catMatch[0], '').trim()
  }

  let entity = ''
  const entMatch = description.match(/(?:para a|para o|para|no|na)\s+([a-zA-ZÀ-ÿ\s]+)(?=\s|$)/i)
  if (entMatch) {
    entity = entMatch[1].trim()
  }

  description = description.replace(/\s+/g, ' ').trim()
  if (description.length > 0) {
    description = description.charAt(0).toUpperCase() + description.slice(1)
  }

  return { amount, description, dateStr, category, entity }
}

export function TransactionFormDrawer({
  open,
  onOpenChange,
  defaultType = 'all',
  editItem,
  startVoiceRecording = false,
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

  const { isListening, transcript, startListening, stopListening, supported, setTranscript } =
    useSpeechRecognition()

  useEffect(() => {
    if (open && startVoiceRecording && supported) {
      const t = setTimeout(() => startListening(), 300)
      return () => clearTimeout(t)
    } else if (!open) {
      stopListening()
      setTranscript('')
    }
  }, [open, startVoiceRecording, supported, startListening, stopListening, setTranscript])

  useEffect(() => {
    if (transcript) {
      const {
        amount: pAmount,
        description: pDesc,
        dateStr: pDate,
        category: pCat,
        entity: pEnt,
      } = parseTranscript(transcript)

      if (pAmount) setAmount(pAmount)
      if (pDate) setDate(pDate)
      if (pCat) setCategory(pCat)
      if (pEnt) setEntity(pEnt)
      if (pDesc) setDescription(pDesc)

      const tLower = transcript.toLowerCase()
      if (tLower.includes('recebi') || tLower.includes('vendi') || tLower.includes('entrou')) {
        setType('entrada')
        setStatus('realizado')
      } else if (
        tLower.includes('gastei') ||
        tLower.includes('paguei') ||
        tLower.includes('comprei') ||
        tLower.includes('saiu')
      ) {
        setType('saida')
        setStatus('realizado')
      }

      toast({
        title: 'Áudio processado',
        description: 'Os campos foram preenchidos. Revise antes de salvar.',
      })
    }
  }, [transcript])

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
      if (!transcript) {
        setDate(new Date().toISOString().split('T')[0])
        setAmount('')
        setEntity('')
        setDescription('')
        setCategory('')
        setStatus('previsto')
        setType(defaultType === 'all' ? 'saida' : defaultType)
      }
    }
  }, [editItem, open, defaultType, transcript])

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

        {!editItem && supported && (
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700">
                Preenchimento Inteligente
              </span>
              {isListening && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </div>

            <Button
              type="button"
              variant={isListening ? 'destructive' : 'secondary'}
              className={cn(
                'w-full transition-all duration-300',
                isListening && 'animate-pulse shadow-md',
              )}
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Ouvindo... (Clique para parar)
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Ditar Lançamento
                </>
              )}
            </Button>

            {transcript && (
              <div className="mt-3 p-3 bg-white border border-slate-100 rounded-md shadow-sm">
                <p className="text-xs text-slate-500 mb-1 font-medium">Transcrição:</p>
                <p className="text-sm text-slate-700 italic">"{transcript}"</p>
              </div>
            )}
          </div>
        )}

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
