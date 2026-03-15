import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const formatMonth = (yyyy_mm: string) => {
  const [y, m] = yyy_mm.split('-')
  const d = new Date(Number(y), Number(m) - 1)
  const name = d.toLocaleDateString('pt-BR', { month: 'long' })
  return name.charAt(0).toUpperCase() + name.slice(1) + '/' + y
}

export default function Index() {
  const { isLoading, financialSummary, cashBreakpoint, activitySummary, transactionsFT } =
    useFinanceStore()
  const [selectedMonth, setSelectedMonth] = useState<string>('current')

  const availableMonths = useMemo(() => {
    const months = new Set<string>()
    financialSummary.forEach((s) => {
      if (s.reference_date) months.add(s.reference_date.substring(0, 7))
    })
    transactionsFT.forEach((t) => {
      if (t.date) months.add(t.date.substring(0, 7))
    })
    return Array.from(months).sort().reverse()
  }, [financialSummary, transactionsFT])

  const activeMonth = useMemo(() => {
    if (selectedMonth === 'all') return null
    if (selectedMonth === 'current') {
      const current = new Date().toISOString().substring(0, 7)
      if (availableMonths.includes(current)) return current
      return availableMonths.length > 0 ? availableMonths[0] : null
    }
    return selectedMonth
  }, [selectedMonth, availableMonths])

  const filteredSummary = useMemo(() => {
    if (!activeMonth) return financialSummary
    return financialSummary.filter((s) => s.reference_date?.startsWith(activeMonth))
  }, [financialSummary, activeMonth])

  const cardData = useMemo(() => {
    if (!filteredSummary || filteredSummary.length === 0) return {}
    return filteredSummary.reduce(
      (acc, curr) => ({
        entrada_realizada: (acc.entrada_realizada || 0) + (curr.entrada_realizada || 0),
        entrada_prevista: (acc.entrada_prevista || 0) + (curr.entrada_prevista || 0),
        saida_realizada: (acc.saida_realizada || 0) + (curr.saida_realizada || 0),
        saida_prevista: (acc.saida_prevista || 0) + (curr.saida_prevista || 0),
      }),
      {} as any,
    )
  }, [filteredSummary])

  const saldoAtual = useMemo(() => {
    return transactionsFT
      .filter((t) => t.nature === 'realizado')
      .reduce((sum, t) => sum + (t.type === 'entrada' ? t.amount : -t.amount), 0)
  }, [transactionsFT])

  const entradas = (cardData.entrada_realizada || 0) + (cardData.entrada_prevista || 0)
  const saidas = (cardData.saida_realizada || 0) + (cardData.saida_prevista || 0)

  const actSummary = activitySummary[0] || {}
  const rupturaData = cashBreakpoint?.rupture_date
  const rupturaRisco = cashBreakpoint?.risk_level || 'Seguro'

  const cashflowData = useMemo(() => {
    if (filteredSummary.length > 0) {
      return [...filteredSummary].reverse().map((s) => ({
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
  }, [filteredSummary])

  const expensesData = useMemo(() => {
    const filteredTxs = activeMonth
      ? transactionsFT.filter((t) => t.date.startsWith(activeMonth) && t.type === 'saida')
      : transactionsFT.filter((t) => t.type === 'saida')

    const agg = filteredTxs.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(agg)
      .map(([name, value], i) => ({
        name: name || 'Outros',
        value,
        fill: `hsl(var(--chart-${(i % 5) + 1}))`,
      }))
      .sort((a, b) => b.value - a.value)
  }, [transactionsFT, activeMonth])

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
        <div className="w-full md:w-[220px]">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Mês Atual</SelectItem>
              <SelectItem value="all">Período Completo</SelectItem>
              {availableMonths.map((m) => (
                <SelectItem key={m} value={m}>
                  {formatMonth(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-subtle hover:shadow-elevation transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Saldo Global Realizado
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(saldoAtual)}</div>
            <p className="text-xs text-slate-500 mt-1">Conta Corrente Total</p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle hover:shadow-elevation transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Entradas do Período
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(entradas)}</div>
            <p className="text-xs text-slate-500 mt-1">Realizado + Previsto</p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle hover:shadow-elevation transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Saídas do Período</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(saidas)}</div>
            <p className="text-xs text-slate-500 mt-1">Realizado + Previsto</p>
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
            <CardTitle>Fluxo de Caixa (Período Selecionado)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {cashflowData.length > 0 ? (
              <ChartContainer
                config={{
                  entrada_realizada: { label: 'Entradas (Realizado)', color: '#22c55e' },
                  entrada_prevista: { label: 'Entradas (Previsto)', color: '#22c55e' },
                  saida_realizada: { label: 'Saídas (Realizado)', color: '#ef4444' },
                  saida_prevista: { label: 'Saídas (Previsto)', color: '#ef4444' },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={cashflowData}
                    margin={{ top: 5, right: 20, bottom: 20, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `R$ ${val / 1000}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />

                    <Line
                      type="monotone"
                      dataKey="entrada_prevista"
                      stroke="var(--color-entrada_prevista)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="saida_prevista"
                      stroke="var(--color-saida_prevista)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="entrada_realizada"
                      stroke="var(--color-entrada_realizada)"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="saida_realizada"
                      stroke="var(--color-saida_realizada)"
                      strokeWidth={3}
                      dot={{ r: 4 }}
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
            <CardTitle>Despesas por Categoria (Período Selecionado)</CardTitle>
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
