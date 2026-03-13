import { X, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import useFinanceStore from '@/stores/useFinanceStore'
import { formatCurrency, formatDate } from '@/utils/formatters'

export function SkipPanel() {
  const { isSkipOpen, toggleSkip, calculateRuptureDay } = useFinanceStore()
  const rupture = calculateRuptureDay()

  return (
    <Sheet open={isSkipOpen} onOpenChange={toggleSkip}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] p-0 flex flex-col bg-slate-50 border-l-0"
      >
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-slate-900" />
            </div>
            <SheetTitle className="text-white text-xl m-0">SKIP Intelligence</SheetTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSkip}
            className="text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-subtle border border-slate-100">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900">Alerta de Fluxo de Caixa</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Identificamos um risco de saldo negativo para o dia{' '}
                  <strong>{rupture.date ? formatDate(rupture.date) : 'N/A'}</strong>.
                </p>
                <div className="mt-3 bg-red-50 border border-red-100 p-3 rounded-md">
                  <p className="text-xs text-red-800 font-medium">Sugestão SKIP:</p>
                  <p className="text-xs text-red-700 mt-1">
                    Negociar prorrogação do boleto "Impostos" (R$ 1.500,00) para o dia 20/03.
                  </p>
                  <Button
                    size="sm"
                    className="mt-2 w-full bg-white text-red-600 border border-red-200 hover:bg-red-50"
                  >
                    Aplicar Sugestão
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-subtle border border-slate-100">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900">Classificação Automática</h4>
                <p className="text-sm text-slate-600 mt-1">
                  3 novas transações foram categorizadas automaticamente com 98% de precisão.
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="text-xs flex justify-between border-b pb-2">
                    <span className="text-slate-600">Posto Ipiranga</span>
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">
                      Combustível
                    </span>
                  </li>
                  <li className="text-xs flex justify-between border-b pb-2">
                    <span className="text-slate-600">Kalunga</span>
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">Manutenção</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
