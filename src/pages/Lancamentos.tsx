import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useFinanceStore from '@/stores/useFinanceStore'
import { TransactionTable } from '@/components/TransactionTable'
import { TransactionFormDrawer } from '@/components/TransactionFormDrawer'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Lancamentos() {
  const location = useLocation()
  const { transactions } = useFinanceStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const filterType = location.pathname.includes('receber')
    ? 'entrada'
    : location.pathname.includes('pagar')
      ? 'saida'
      : 'all'

  const filteredTransactions = useMemo(() => {
    let txs = transactions
    if (filterType !== 'all') {
      txs = transactions.filter((t) => t.type === filterType)
    }
    // Sort by date descending
    return [...txs].sort((a, b) => b.date.localeCompare(a.date))
  }, [transactions, filterType])

  const titles = {
    all: 'Todos Lançamentos',
    entrada: 'Contas a Receber',
    saida: 'Contas a Pagar',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{titles[filterType]}</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie suas transações financeiras e acompanhe os status.
          </p>
        </div>
        <Button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Lançamento
        </Button>
      </div>

      <TransactionTable transactions={filteredTransactions} />

      <TransactionFormDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        defaultType={filterType}
      />
    </div>
  )
}
