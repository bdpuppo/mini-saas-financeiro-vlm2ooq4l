import useFinanceStore from '@/stores/useFinanceStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getStatusClass, formatDate } from '@/utils/formatters'
import { Loader2 } from 'lucide-react'

export default function Atividades() {
  const { activities, isLoading } = useFinanceStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lista de Atividades</h1>
        <p className="text-slate-500 text-sm mt-1">
          Acompanhamento operacional de tarefas e status.
        </p>
      </div>

      <div className="rounded-md border bg-white shadow-subtle overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">Data</TableHead>
              <TableHead>Atividade</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && activities.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                  Nenhuma atividade encontrada no banco de dados.
                </TableCell>
              </TableRow>
            ) : (
              activities.map((act) => (
                <TableRow key={act.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-500">
                    {formatDate(act.activity_date)}
                  </TableCell>
                  <TableCell>{act.title}</TableCell>
                  <TableCell>
                    <div
                      className={`px-2 py-1 rounded text-center text-xs uppercase font-semibold ${getStatusClass(act.status)}`}
                    >
                      {act.status}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
