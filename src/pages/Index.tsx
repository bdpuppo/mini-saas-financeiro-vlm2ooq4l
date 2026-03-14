import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Wallet, TrendingUp, AlertOctagon, TrendingDown } from 'lucide-react'
import useFinanceStore from '@/stores/useFinanceStore'
import { formatCurrency, formatDate } from '@/utils/formatters'

export default function Index() {
  const { isLoading, financialSummary, cashBreakpoint, activitySummary, expensesByCategory } =
    useFinanceStore()

  const cardData = financialSummary[0] || {}
  const actSummary = activitySummary[0] || {}

  const saldoAtual = cardData.saldo_transacoes || 0
  const entradas = (cardData.entrada_realizada || 0) + (cardData.entrada_prevista || 0)
  const saidas = (cardData.saida_realizada || 0) + (cardData.saida_prevista || 0)

  const rupturaData = cashBreakpoint?.rupture_date
  const rupturaRisco = cashBreakpoint?.risk_level || 'Seguro'

  const cashflowData = useMemo(() => {
    if (financialSummary.length > 0) {
      return [...financialSummary].reverse().map((s) => ({
        date: s.reference_date
          ? s.reference_date.substring(8, 10) + '/' + s.reference_date.substring(5, 7)
          : '',
        entrada_realizada: Number(s.entrada_realizada || 0),
        saida_realizada: Number(s.saida_realizada || 0),
        entrada_prevista: Number(s.entrada_prevista || 0),
        saida_prevista: Number(s.saida_prevista || 0),
      }))
    }
    return []
  }, [financialSummary])

  const expensesData = useMemo(() => {
    return expensesByCategory.map((e) => ({
      name: e.category_name || 'Outros',
      value: Number(e.total_expense || 0),
      fill: e.category_color || 'hsl(var(--primary))',
    }))
  }, [expensesByCategory])

  if (isLoading && financialSummary.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-[350px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Executivo</h1>
          <p className="text-slate-500">
            Visão gerencial do fluxo de caixa e inteligência de dados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-subtle hover:shadow-elevation transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Saldo Atual</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(saldoAtual)}</div>
            <p className="text-xs text-slate-500 mt-1">Conta Corrente</p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle hover:shadow-elevation transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Entradas Previstas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(entradas)}</div>
            <p className="text-xs text-slate-500 mt-1">Acumulado do Mês</p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle hover:shadow-elevation transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Saídas Previstas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(saidas)}</div>
            <p className="text-xs text-slate-500 mt-1">Acumulado do Mês</p>
          </CardContent>
        </Card>

        <Card
          className={`shadow-subtle hover:shadow-elevation transition-all border-l-4 ${rupturaData ? 'border-l-red-500 bg-red-50/30' : 'border-l-green-500'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-900">Dia de Ruptura</CardTitle>
            <AlertOctagon
              className={`h-4 w-4 ${rupturaData ? 'text-red-500' : 'text-green-500'}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${rupturaData ? 'text-red-600' : 'text-green-600'}`}
            >
              {rupturaData ? formatDate(rupturaData) : 'Seguro'}
            </div>
            <p
              className={`text-xs font-medium mt-1 ${rupturaData ? 'text-red-500' : 'text-green-500'}`}
            >
              Risco: {rupturaRisco}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {cashflowData.length > 0 ? (
              <ChartContainer
                config={{
                  entrada_realizada: { label: 'Entradas', color: 'hsl(var(--primary))' },
                  saida_realizada: { label: 'Saídas', color: '#dc2626' },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashflowData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `R$ ${val / 1000}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="entrada_prevista"
                      stroke="#86efac"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="5 5"
                      name="Entradas (Prev)"
                    />
                    <Line
                      type="monotone"
                      dataKey="saida_prevista"
                      stroke="#fca5a5"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="5 5"
                      name="Saídas (Prev)"
                    />
                    <Line
                      type="monotone"
                      dataKey="entrada_realizada"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      name="Entradas (Real)"
                    />
                    <Line
                      type="monotone"
                      dataKey="saida_realizada"
                      stroke="#dc2626"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      name="Saídas (Real)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                Sem dados para exibir
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {expensesData.length > 0 ? (
              <ChartContainer config={{ value: { label: 'Total', color: 'hsl(var(--primary))' } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expensesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `R$ ${val / 1000}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {expensesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                Sem dados para exibir
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Status de Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            {activitySummary.length > 0 ? (
              <div className="space-y-6 mt-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700">Concluídas (OK)</span>
                    <span className="font-bold text-green-600">
                      {actSummary.percentual_ok || 0}%
                    </span>
                  </div>
                  <Progress
                    value={actSummary.percentual_ok || 0}
                    className="h-3 [&>div]:bg-green-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700">Em Andamento</span>
                    <span className="font-bold text-blue-600">
                      {actSummary.percentual_em_andamento || 0}%
                    </span>
                  </div>
                  <Progress
                    value={actSummary.percentual_em_andamento || 0}
                    className="h-3 [&>div]:bg-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700">Paradas / Aguardando</span>
                    <span className="font-bold text-yellow-600">
                      {100 -
                        (actSummary.percentual_ok || 0) -
                        (actSummary.percentual_em_andamento || 0)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      100 -
                      (actSummary.percentual_ok || 0) -
                      (actSummary.percentual_em_andamento || 0)
                    }
                    className="h-3 [&>div]:bg-yellow-500"
                  />
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-500">Sem dados para exibir</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
