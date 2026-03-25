import { useState, useEffect } from 'react'
import useFinanceStore, { Activity } from '@/stores/useFinanceStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ActivityFormDrawer } from '@/components/ActivityFormDrawer'
import { ImportCSVModal } from '@/components/ImportCSVModal'
import { VoiceEntryFormModal } from '@/components/VoiceEntryFormModal'
import { getStatusClass, formatDate } from '@/utils/formatters'
import { useSpeechRecognition } from '@/hooks/use-speech'
import { Loader2, Plus, Pencil, Trash, Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Atividades() {
  const { activities, isLoading, deleteActivity, addActivity } = useFinanceStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editAct, setEditAct] = useState<Activity | null>(null)

  const { isListening, transcript, startListening, stopListening, supported, setTranscript } =
    useSpeechRecognition()
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [voiceData, setVoiceData] = useState<any>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
      await deleteActivity(id)
    }
  }

  const handleImportAtividades = async (data: any[]) => {
    for (const row of data) {
      await addActivity({
        title: row.descricao || 'Atividade Importada',
        activity_date: row.data || new Date().toISOString().split('T')[0],
        status: row.status || 'Aguardando',
        responsible: row.responsavel || '',
      })
    }
  }

  const handleVoice = () => {
    if (isListening) stopListening()
    else startListening()
  }

  useEffect(() => {
    if (transcript && !isListening) {
      const data = new Date().toISOString().split('T')[0]
      let status = 'Aguardando'
      const tLower = transcript.toLowerCase()

      if (tLower.includes('concluído') || tLower.includes('concluido') || tLower.includes('ok'))
        status = 'OK'
      if (tLower.includes('pendente')) status = 'Aguardando'
      if (tLower.includes('andamento')) status = 'Andamento'

      let responsavel = ''
      const respMatch = transcript.match(/responsável\s+([a-zA-ZÀ-ÿ]+)/i)
      if (respMatch) {
        responsavel = respMatch[1]
      }

      setVoiceData({
        descricao: transcript,
        data,
        status,
        responsavel,
      })
      setShowVoiceModal(true)
      setTranscript('')
    }
  }, [transcript, isListening, setTranscript])

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lista de Atividades</h1>
          <p className="text-slate-500 text-sm mt-1">
            Acompanhamento operacional de tarefas e registros de voz.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ImportCSVModal onImport={handleImportAtividades} modelType="atividades" />

          {supported && (
            <Button
              onClick={handleVoice}
              variant={isListening ? 'destructive' : 'outline'}
              className={cn(
                'transition-colors',
                isListening ? 'animate-pulse' : 'text-primary border-primary/20 hover:bg-primary/5',
              )}
            >
              {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isListening ? 'Ouvindo...' : 'Inserir por Voz'}
            </Button>
          )}

          <Button
            onClick={() => setIsDrawerOpen(true)}
            className="bg-primary shadow-sm"
            disabled={isLoading && activities.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-subtle overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
              <TableHead className="w-[90px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && activities.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Nenhuma atividade encontrada no banco de dados.
                </TableCell>
              </TableRow>
            ) : (
              activities.map((act) => (
                <TableRow key={act.id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="font-medium text-slate-500">
                    {formatDate(act.activity_date)}
                  </TableCell>
                  <TableCell className="font-medium text-slate-800">{act.title}</TableCell>
                  <TableCell className="text-slate-600">{act.responsible || '-'}</TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        'px-2 py-1 rounded text-center text-xs uppercase font-semibold',
                        getStatusClass(act.status),
                      )}
                    >
                      {act.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-slate-900"
                        onClick={() => setEditAct(act)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(act.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ActivityFormDrawer
        open={isDrawerOpen || !!editAct}
        onOpenChange={(val) => {
          setIsDrawerOpen(val)
          if (!val) setEditAct(null)
        }}
        editItem={editAct}
      />

      <VoiceEntryFormModal
        open={showVoiceModal}
        onOpenChange={setShowVoiceModal}
        initialData={voiceData}
      />
    </div>
  )
}
