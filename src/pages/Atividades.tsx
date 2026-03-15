import { useState } from 'react'
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
import { Progress } from '@/components/ui/progress'
import { ActivityFormDrawer } from '@/components/ActivityFormDrawer'
import { getStatusClass, formatDate } from '@/utils/formatters'
import { Loader2, Plus, Pencil, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Atividades() {
  const { activities, isLoading, deleteActivity } = useFinanceStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editAct, setEditAct] = useState<Activity | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
      await deleteActivity(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lista de Atividades</h1>
          <p className="text-slate-500 text-sm mt-1">
            Acompanhamento operacional de tarefas e status da equipe.
          </p>
        </div>
        <Button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-primary shadow-sm"
          disabled={isLoading && activities.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Atividade
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-subtle overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">Data</TableHead>
              <TableHead>Atividade</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
              <TableHead className="w-[120px]">Progresso</TableHead>
              <TableHead className="max-w-[200px]">Notas</TableHead>
              <TableHead className="w-[90px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && activities.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
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
                  <TableCell>
                    <div className="w-full flex items-center gap-2">
                      <Progress value={act.percentage || 0} className="h-2 flex-1" />
                      <span className="text-xs text-slate-500 font-medium w-8 text-right">
                        {act.percentage || 0}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate text-slate-500 italic"
                    title={act.notes || ''}
                  >
                    {act.notes || '-'}
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
    </div>
  )
}
