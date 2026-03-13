import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { Wallet, TrendingUp, AlertOctagon, ArrowRightLeft } from 'lucide-react'
import useFinanceStore from '@/stores/useFinanceStore'
import { formatCurrency, formatDate } from '@/utils/formatters'

export default function Index() {
  const { calculateRuptureDay } = useFinanceStore()
  const rupture = calculateRuptureDay()

  const cashflowData = [
    { date: '01/03', previsto: 12000, realizado: 11500 },
    { date: '05/03', previsto: 15000, realizado: 14200 },
    { date: '10/03', previsto: 8000, realizado: 8500 },
    { date: '15/03', previsto: 5000, realizado: 0 },
    { date: '20/03', previsto: 18000, realizado: 0 },
  ]

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
            <div className="text-2xl font-bold">R$ 55,66</div>
            <p className="text-xs text-slate-500 mt-1">Conta Corrente</p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle hover:shadow-elevation transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Projetado (Fim do Mês)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 14.320,00</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% vs Mês Anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle hover:shadow-elevation transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Capital de Giro</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.000,00</div>
            <p className="text-xs text-slate-500 mt-1">Necessidade Mensal</p>
          </CardContent>
        </Card>

        <Card
          className={`shadow-subtle hover:shadow-elevation transition-all border-l-4 ${rupture.date ? 'border-l-red-500 bg-red-50/30' : 'border-l-green-500'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-900">Dia de Ruptura</CardTitle>
            <AlertOctagon
              className={`h-4 w-4 ${rupture.date ? 'text-red-500' : 'text-green-500'}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${rupture.date ? 'text-red-600' : 'text-green-600'}`}
            >
              {rupture.date ? formatDate(rupture.date) : 'Seguro'}
            </div>
            <p
              className={`text-xs font-medium mt-1 ${rupture.date ? 'text-red-500' : 'text-green-500'}`}
            >
              Risco: {rupture.risk}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Fluxo de Caixa: Previsto vs Realizado</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                previsto: { label: 'Previsto', color: 'hsl(var(--muted-foreground))' },
                realizado: { label: 'Realizado', color: 'hsl(var(--primary))' },
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
                    dataKey="previsto"
                    stroke="var(--color-previsto)"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="realizado"
                    stroke="var(--color-realizado)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Entradas x Saídas (Março)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                entrada: { label: 'Entradas', color: 'hsl(var(--chart-3))' },
                saida: { label: 'Saídas', color: 'hsl(var(--chart-4))' },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `R$ ${val / 1000}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="previsto"
                    name="Entradas"
                    fill="var(--color-entrada)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="realizado"
                    name="Saídas"
                    fill="var(--color-saida)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
