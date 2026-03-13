import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'

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
  observations?: string
}

interface FinanceStoreContext {
  transactions: Transaction[]
  activities: Activity[]
  isSkipOpen: boolean
  currentDate: string
  toggleSkip: () => void
  setCurrentDate: (date: string) => void
  addTransaction: (t: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, partial: Partial<Transaction>) => void
  updateTransactionStatus: (id: string, status: TransactionStatus) => void
  updateActivity: (id: string, partial: Partial<Activity>) => void
  calculateRuptureDay: () => { date: string | null; risk: 'Baixo' | 'Médio' | 'Alto' | 'Crítico' }
}

export const FinanceContext = createContext<FinanceStoreContext | null>(null)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [isSkipOpen, setIsSkipOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const { session } = useAuth()

  useEffect(() => {
    if (session?.user) {
      fetchData()
    }
  }, [session?.user])

  const fetchData = async () => {
    try {
      const [resTx, resAct] = await Promise.all([
        supabase.from('lancamentos').select('*').order('date', { ascending: false }),
        supabase.from('atividades').select('*').order('date', { ascending: false }),
      ])
      if (resTx.data) setTransactions(resTx.data as Transaction[])
      if (resAct.data) setActivities(resAct.data as Activity[])
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const toggleSkip = () => setIsSkipOpen(!isSkipOpen)

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    const { data, error } = await supabase.from('lancamentos').insert(t).select().single()
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o lançamento.',
        variant: 'destructive',
      })
      return
    }
    if (data) setTransactions((prev) => [data as Transaction, ...prev])
  }

  const updateTransaction = async (id: string, partial: Partial<Transaction>) => {
    const { error } = await supabase.from('lancamentos').update(partial).eq('id', id)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o lançamento.',
        variant: 'destructive',
      })
      return
    }
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...partial } : t)))
  }

  const updateTransactionStatus = (id: string, status: TransactionStatus) => {
    updateTransaction(id, { status })
  }

  const updateActivity = async (id: string, partial: Partial<Activity>) => {
    const { error } = await supabase.from('atividades').update(partial).eq('id', id)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a atividade.',
        variant: 'destructive',
      })
      return
    }
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...partial } : a)))
  }

  const calculateRuptureDay = () => {
    let balance = 55.66
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
    updateTransaction,
    updateTransactionStatus,
    updateActivity,
    calculateRuptureDay,
  }

  return React.createElement(FinanceContext.Provider, { value }, children)
}

export default function useFinanceStore() {
  const context = useContext(FinanceContext)
  if (!context) throw new Error('useFinanceStore must be used within FinanceProvider')
  return context
}
