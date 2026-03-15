import { Transaction } from '@/stores/useFinanceStore'
import { formatCurrency } from '@/utils/formatters'

interface FinancePanelProps {
  receivables: Transaction[]
  payables: Transaction[]
  saldoRealizado: number
  saldoPrevisto: number
}

export function FinancePanel({
  receivables,
  payables,
  saldoRealizado,
  saldoPrevisto,
}: FinancePanelProps) {
  const sumReceivables = receivables.reduce((sum, t) => sum + t.amount, 0)
  const sumPayables = payables.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-4">
      {/* Resumo */}
      <table className="w-full text-sm border-collapse border border-slate-800 bg-white shadow-sm">
        <thead>
          <tr className="bg-slate-200">
            <th className="border border-slate-800 p-1.5 w-1/3"></th>
            <th className="border border-slate-800 p-1.5 w-1/3">Previsto (Global)</th>
            <th className="border border-slate-800 p-1.5 w-1/3">Realizado (Global)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-800 p-1.5 font-bold">Saldo em Conta</td>
            <td className="border border-slate-800 p-1.5 text-center">
              {formatCurrency(saldoPrevisto)}
            </td>
            <td className="border border-slate-800 p-1.5 text-center">
              {formatCurrency(saldoRealizado)}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-800 p-1.5 font-bold text-blue-800">
              Valores a Receber Hoje
            </td>
            <td className="border border-slate-800 p-1.5 text-center">
              {formatCurrency(sumReceivables)}
            </td>
            <td className="border border-slate-800 p-1.5 text-center">
              {formatCurrency(sumReceivables)}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-800 p-1.5 font-bold text-red-800">
              Valores a Pagar Hoje
            </td>
            <td className="border border-slate-800 p-1.5 text-center">
              {formatCurrency(sumPayables)}
            </td>
            <td className="border border-slate-800 p-1.5 text-center">
              {formatCurrency(sumPayables)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Recebíveis */}
      <div className="border border-slate-800 bg-white shadow-sm">
        <div className="bg-yellow-500 text-slate-900 text-center py-1.5 font-bold border-b border-slate-800">
          Recebíveis
        </div>
        <table className="w-full text-sm text-center">
          <thead className="bg-slate-100 text-xs">
            <tr>
              <th className="border-r border-b border-slate-300 p-1.5 w-1/4">Cliente</th>
              <th className="border-r border-b border-slate-300 p-1.5 w-1/12">Cat</th>
              <th className="border-r border-b border-slate-300 p-1.5 flex-1">Descrição</th>
              <th className="border-r border-b border-slate-300 p-1.5 w-1/6">Status</th>
              <th className="border-b border-slate-300 p-1.5 w-1/5">Valor</th>
            </tr>
          </thead>
          <tbody>
            {receivables.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="border-r border-b border-slate-200 p-1.5">{t.entity}</td>
                <td className="border-r border-b border-slate-200 p-1.5">
                  {t.category !== 'Sem Categoria' ? t.category.substring(0, 3) : ''}
                </td>
                <td className="border-r border-b border-slate-200 p-1.5 text-left">
                  {t.description}
                </td>
                <td className="border-r border-b border-slate-200 p-1.5 capitalize">{t.status}</td>
                <td className="border-b border-slate-200 p-1.5 font-mono text-right pr-2">
                  {formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
            {receivables.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-slate-400">
                  Nenhum recebível previsto para hoje.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* A Pagar */}
      <div className="border border-slate-800 bg-white shadow-sm">
        <div className="bg-slate-200 text-slate-900 text-center py-1.5 font-bold border-b border-slate-800">
          A Pagar
        </div>
        <table className="w-full text-sm text-center">
          <thead className="bg-slate-100 text-xs">
            <tr>
              <th className="border-r border-b border-slate-300 p-1.5 w-1/4">Favorecido</th>
              <th className="border-r border-b border-slate-300 p-1.5 w-1/12">Cat</th>
              <th className="border-r border-b border-slate-300 p-1.5 flex-1">Descrição</th>
              <th className="border-r border-b border-slate-300 p-1.5 w-1/6">Status</th>
              <th className="border-b border-slate-300 p-1.5 w-1/5">Valor</th>
            </tr>
          </thead>
          <tbody>
            {payables.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="border-r border-b border-slate-200 p-1.5">{t.entity}</td>
                <td className="border-r border-b border-slate-200 p-1.5">
                  {t.category !== 'Sem Categoria' ? t.category.substring(0, 3) : ''}
                </td>
                <td className="border-r border-b border-slate-200 p-1.5 text-left">
                  {t.description}
                </td>
                <td className="border-r border-b border-slate-200 p-1.5 capitalize">{t.status}</td>
                <td className="border-b border-slate-200 p-1.5 font-mono text-right pr-2">
                  {formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
            {payables.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-slate-400">
                  Nenhuma conta a pagar prevista para hoje.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
