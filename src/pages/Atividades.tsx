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

export default function Atividades() {
  const { activities } = useFinanceStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lista de Atividades</h1>
        <p className="text-slate-500 text-sm mt-1">Acompanhamento operacional de tarefas.</p>
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
            {activities.map((act) => (
              <TableRow key={act.id} className="hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-500">
                  {formatDate(act.activity_date)}
                </TableCell>
                <TableCell>{act.title}</TableCell>
                <TableCell>
                  <div
                    className={`px-2 py-1 rounded text-center text-xs uppercase ${getStatusClass(act.status)}`}
                  >
                    {act.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
