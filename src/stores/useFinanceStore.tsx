import React, { createContext, useContext, useState, useMemo } from 'react'

export type TransactionType = 'entrada' | 'saida'
export type TransactionStatus = 'previsto' | 'realizado'
export type ActivityStatus = 'ok' | 'andamento' | 'aguardando' | 'parado'

export interface Transaction {
  id: string
  date: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  entity: string
  description: string
  category: string
}

export interface Activity {
  id: string
  date: string
  title: string
  status: ActivityStatus
  time?: string
}

interface FinanceStoreContext {
  transactions: Transaction[]
  activities: Activity[]
  isSkipOpen: boolean
  currentDate: string
  toggleSkip: () => void
  setCurrentDate: (date: string) => void
  addTransaction: (t: Transaction) => void
  updateTransactionStatus: (id: string, status: TransactionStatus) => void
  calculateRuptureDay: () => { date: string | null; risk: 'Baixo' | 'Médio' | 'Alto' | 'Crítico' }
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2026-03-11',
    type: 'entrada',
    status: 'realizado',
    amount: 120,
    entity: 'Bruna',
    description: 'Emprestimo',
    category: 'Outros',
  },
  {
    id: '2',
    date: '2026-03-11',
    type: 'saida',
    status: 'previsto',
    amount: 164,
    entity: 'Cosme',
    description: 'VT',
    category: 'RH',
  },
  {
    id: '3',
    date: '2026-03-11',
    type: 'saida',
    status: 'realizado',
    amount: 172.5,
    entity: 'Braspress',
    description: 'Boleto',
    category: 'Frete',
  },
  {
    id: '4',
    date: '2026-03-12',
    type: 'entrada',
    status: 'realizado',
    amount: 700,
    entity: 'Multitex',
    description: 'Recebimento',
    category: 'Vendas',
  },
  {
    id: '5',
    date: '2026-03-12',
    type: 'saida',
    status: 'realizado',
    amount: 300,
    entity: 'Açovisa',
    description: 'Tarugo Harsco',
    category: 'Fornecedor',
  },
  {
    id: '6',
    date: '2026-03-15',
    type: 'saida',
    status: 'previsto',
    amount: 1500,
    entity: 'Impostos',
    description: 'DAS',
    category: 'Impostos',
  },
]

const mockActivities: Activity[] = [
  { id: '1', date: '2026-03-11', title: 'Exame Mama - 09:00', status: 'ok', time: '09:00' },
  { id: '2', date: '2026-03-11', title: 'Cotação do Frete Bomba', status: 'parado' },
  { id: '3', date: '2026-03-11', title: 'Pagar Boleto Braspress', status: 'ok' },
  { id: '4', date: '2026-03-11', title: 'Programas PCMSO', status: 'aguardando' },
  { id: '5', date: '2026-03-11', title: 'Cotação Harsco', status: 'andamento' },
  { id: '6', date: '2026-03-11', title: 'Cotação Spreader IRB', status: 'andamento' },
  { id: '7', date: '2026-03-11', title: 'Cotação Spreader MTX', status: 'parado' },
  { id: '8', date: '2026-03-11', title: 'Proposta Conector', status: 'ok' },
]

export const FinanceContext = createContext<FinanceStoreContext | null>(null)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [activities] = useState<Activity[]>(mockActivities)
  const [isSkipOpen, setIsSkipOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState('2026-03-11')

  const toggleSkip = () => setIsSkipOpen(!isSkipOpen)

  const addTransaction = (t: Transaction) => setTransactions([...transactions, t])

  const updateTransactionStatus = (id: string, status: TransactionStatus) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  const calculateRuptureDay = () => {
    let balance = 55.66 // Initial balance for mock scenario
    const futureTx = transactions
      .filter((t) => t.date >= currentDate && t.status === 'previsto')
      .sort((a, b) => a.date.localeCompare(b.date))

    for (const tx of futureTx) {
      balance += tx.type === 'entrada' ? tx.amount : -tx.amount
      if (balance < 0) {
        return { date: tx.date, risk: 'Crítico' as const }
      }
    }
    return { date: null, risk: 'Baixo' as const }
  }

  const value = {
    transactions,
    activities,
    isSkipOpen,
    currentDate,
    toggleSkip,
    setCurrentDate,
    addTransaction,
    updateTransactionStatus,
    calculateRuptureDay,
  }

  return React.createElement(FinanceContext.Provider, { value }, children)
}

export default function useFinanceStore() {
  const context = useContext(FinanceContext)
  if (!context) throw new Error('useFinanceStore must be used within FinanceProvider')
  return context
}
