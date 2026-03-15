import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'

export type TransactionType = 'entrada' | 'saida'
export type TransactionStatus =
  | 'previsto'
  | 'realizado'
  | 'pago'
  | 'recebido'
  | 'vencido'
  | 'cancelado'
  | 'atrasado'
  | string
export type ActivityStatus = 'OK' | 'Andamento' | 'Aguardando' | 'Parado'

export interface Transaction {
  id: string
  date: string
  paid_date?: string | null
  received_date?: string | null
  type: TransactionType
  status: string
  amount: number
  entity: string
  description: string
  category: string
  costCenter: string
  rawSource?: 'ft' | 'ap' | 'ar'
}

export interface Activity {
  id: string
  activity_date: string
  title: string
  status: ActivityStatus
  responsible?: string | null
  percentage?: number
  notes?: string | null
}

interface FinanceStoreContext {
  isLoading: boolean
  isSkipOpen: boolean
  currentDate: string
  financialSummary: any[]
  cashBreakpoint: any
  activitySummary: any[]
  expensesByCategory: any[]
  cashflowSnapshots: any[]
  transactionsFT: Transaction[]
  transactionsAP: Transaction[]
  transactionsAR: Transaction[]
  activities: Activity[]
  categories: any[]
  counterparties: any[]
  costCenters: any[]
  toggleSkip: () => void
  setCurrentDate: (date: string) => void
  addTransaction: (t: any) => Promise<void>
  updateTransaction: (id: string, partial: any, rawSource?: string) => Promise<void>
  updateTransactionStatus: (id: string, status: string, rawSource?: string) => Promise<void>
  addActivity: (partial: Partial<Activity>) => Promise<void>
  updateActivity: (id: string, partial: Partial<Activity>) => Promise<void>
  deleteActivity: (id: string) => Promise<void>
  fetchData: () => Promise<void>
}

export const FinanceContext = createContext<FinanceStoreContext | null>(null)

const mapFT = (t: any): Transaction => ({
  id: t.id,
  date: t.transaction_date,
  type: t.type,
  status: t.nature,
  amount: Number(t.amount),
  entity: t.counterparties?.name || 'Desconhecido',
  description: t.description || '',
  category: t.financial_categories?.name || 'Sem Categoria',
  costCenter: t.cost_centers?.name || 'Geral',
  rawSource: 'ft',
})

const mapAP = (t: any): Transaction => ({
  id: t.id,
  date: t.expected_date,
  paid_date: t.paid_date,
  type: 'saida',
  status: t.status,
  amount: Number(t.amount),
  entity: t.counterparties?.name || 'Desconhecido',
  description: t.description || '',
  category: t.financial_categories?.name || 'Sem Categoria',
  costCenter: t.cost_centers?.name || 'Geral',
  rawSource: 'ap',
})

const mapAR = (t: any): Transaction => ({
  id: t.id,
  date: t.expected_date,
  received_date: t.received_date,
  type: 'entrada',
  status: t.status,
  amount: Number(t.amount),
  entity: t.counterparties?.name || 'Desconhecido',
  description: t.description || '',
  category: t.financial_categories?.name || 'Sem Categoria',
  costCenter: t.cost_centers?.name || 'Geral',
  rawSource: 'ar',
})

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSkipOpen, setIsSkipOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])

  const [financialSummary, setFinancialSummary] = useState<any[]>([])
  const [cashBreakpoint, setCashBreakpoint] = useState<any>(null)
  const [activitySummary, setActivitySummary] = useState<any[]>([])
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([])
  const [cashflowSnapshots, setCashflowSnapshots] = useState<any[]>([])

  const [transactionsFT, setTransactionsFT] = useState<Transaction[]>([])
  const [transactionsAP, setTransactionsAP] = useState<Transaction[]>([])
  const [transactionsAR, setTransactionsAR] = useState<Transaction[]>([])
  const [activities, setActivities] = useState<Activity[]>([])

  const [categories, setCategories] = useState<any[]>([])
  const [counterparties, setCounterparties] = useState<any[]>([])
  const [costCenters, setCostCenters] = useState<any[]>([])

  const { session } = useAuth()

  useEffect(() => {
    if (session?.user) fetchData()
    else {
      setTransactionsFT([])
      setTransactionsAP([])
      setTransactionsAR([])
      setActivities([])
      setCashflowSnapshots([])
    }
  }, [session?.user])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [
        resFinSummary,
        resCashBreakpoint,
        resActSummary,
        resExpCategory,
        resFinTx,
        resAp,
        resAr,
        resAct,
        resCat,
        resCount,
        resCc,
        resSnapshots,
      ] = await Promise.all([
        supabase
          .from('v_financial_summary')
          .select('*')
          .order('reference_date', { ascending: false }),
        supabase.from('v_cash_breakpoint').select('*').limit(1).maybeSingle(),
        supabase
          .from('v_activity_summary')
          .select('*')
          .order('reference_date', { ascending: false }),
        supabase.from('v_expenses_by_category').select('*'),
        supabase
          .from('financial_transactions')
          .select(`*, counterparties(name), financial_categories(name), cost_centers(name)`)
          .order('transaction_date', { ascending: false }),
        supabase
          .from('accounts_payable')
          .select(`*, counterparties(name), financial_categories(name), cost_centers(name)`)
          .order('expected_date', { ascending: false }),
        supabase
          .from('accounts_receivable')
          .select(`*, counterparties(name), financial_categories(name), cost_centers(name)`)
          .order('expected_date', { ascending: false }),
        supabase.from('activities').select('*').order('activity_date', { ascending: false }),
        supabase.from('financial_categories').select('*'),
        supabase.from('counterparties').select('*'),
        supabase.from('cost_centers').select('*'),
        supabase
          .from('cashflow_snapshots')
          .select('*')
          .order('reference_date', { ascending: false }),
      ])

      if (resFinSummary.data) setFinancialSummary(resFinSummary.data)
      if (resCashBreakpoint.data) setCashBreakpoint(resCashBreakpoint.data)
      if (resActSummary.data) setActivitySummary(resActSummary.data)
      if (resExpCategory.data) setExpensesByCategory(resExpCategory.data)

      if (resFinTx.data) setTransactionsFT(resFinTx.data.map(mapFT))
      if (resAp.data) setTransactionsAP(resAp.data.map(mapAP))
      if (resAr.data) setTransactionsAR(resAr.data.map(mapAR))
      if (resAct.data) setActivities(resAct.data as Activity[])

      if (resCat.data) setCategories(resCat.data)
      if (resCount.data) setCounterparties(resCount.data)
      if (resCc.data) setCostCenters(resCc.data)
      if (resSnapshots.data) setCashflowSnapshots(resSnapshots.data)
    } catch (err) {
      console.error('Error fetching data:', err)
      toast({ title: 'Erro', description: 'Falha ao carregar dados.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSkip = () => setIsSkipOpen(!isSkipOpen)

  const getOrCreateRefs = async (categoryName: string, entityName: string) => {
    let categoryId = categories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase())?.id
    if (!categoryId && categoryName) {
      const { data } = await supabase
        .from('financial_categories')
        .insert({ name: categoryName })
        .select()
        .single()
      if (data) categoryId = data.id
    }
    let counterpartyId = counterparties.find(
      (c) => c.name.toLowerCase() === entityName.toLowerCase(),
    )?.id
    if (!counterpartyId && entityName) {
      const { data } = await supabase
        .from('counterparties')
        .insert({ name: entityName, type: 'outro' })
        .select()
        .single()
      if (data) counterpartyId = data.id
    }
    return { categoryId, counterpartyId }
  }

  const addTransaction = async (t: any) => {
    setIsLoading(true)
    try {
      const { categoryId, counterpartyId } = await getOrCreateRefs(t.category, t.entity)
      let table = 'financial_transactions'
      let payload: any = { description: t.description, amount: t.amount, category_id: categoryId }

      if (t.status === 'previsto') {
        if (t.type === 'entrada') {
          table = 'accounts_receivable'
          payload.expected_date = t.date
          payload.customer_id = counterpartyId
          payload.status = 'previsto'
        } else {
          table = 'accounts_payable'
          payload.expected_date = t.date
          payload.supplier_id = counterpartyId
          payload.status = 'previsto'
        }
      } else {
        table = 'financial_transactions'
        payload.transaction_date = t.date
        payload.type = t.type
        payload.nature = 'realizado'
        payload.counterparty_id = counterpartyId
      }

      const { error } = await supabase.from(table).insert(payload)
      if (error) throw error
      await fetchData()
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateTransaction = async (id: string, t: any, rawSource?: string) => {
    setIsLoading(true)
    try {
      const { categoryId, counterpartyId } = await getOrCreateRefs(t.category, t.entity)
      let table =
        rawSource === 'ap'
          ? 'accounts_payable'
          : rawSource === 'ar'
            ? 'accounts_receivable'
            : 'financial_transactions'
      let payload: any = { description: t.description, amount: t.amount, category_id: categoryId }

      if (rawSource === 'ap') {
        payload.expected_date = t.date
        payload.supplier_id = counterpartyId
        payload.status = t.status
      } else if (rawSource === 'ar') {
        payload.expected_date = t.date
        payload.customer_id = counterpartyId
        payload.status = t.status
      } else {
        payload.transaction_date = t.date
        payload.type = t.type
        payload.nature = t.status
        payload.counterparty_id = counterpartyId
      }

      const { error } = await supabase.from(table).update(payload).eq('id', id)
      if (error) throw error
      await fetchData()
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateTransactionStatus = async (id: string, status: string, rawSource?: string) => {
    let table =
      rawSource === 'ap'
        ? 'accounts_payable'
        : rawSource === 'ar'
          ? 'accounts_receivable'
          : 'financial_transactions'
    let col = rawSource === 'ap' || rawSource === 'ar' ? 'status' : 'nature'
    let finalStatus =
      rawSource === 'ap'
        ? status === 'realizado'
          ? 'pago'
          : 'previsto'
        : rawSource === 'ar'
          ? status === 'realizado'
            ? 'recebido'
            : 'previsto'
          : status

    const { error } = await supabase
      .from(table)
      .update({ [col]: finalStatus })
      .eq('id', id)
    if (!error) await fetchData()
    else
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      })
  }

  const addActivity = async (payload: Partial<Activity>) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from('activities').insert(payload)
      if (error) throw error
      await fetchData()
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro', description: 'Falha ao adicionar atividade.', variant: 'destructive' })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateActivity = async (id: string, partial: Partial<Activity>) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from('activities').update(partial).eq('id', id)
      if (error) throw error
      await fetchData()
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro', description: 'Falha ao atualizar atividade.', variant: 'destructive' })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteActivity = async (id: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from('activities').delete().eq('id', id)
      if (error) throw error
      await fetchData()
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro', description: 'Falha ao excluir atividade.', variant: 'destructive' })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    isLoading,
    isSkipOpen,
    currentDate,
    financialSummary,
    cashBreakpoint,
    activitySummary,
    expensesByCategory,
    cashflowSnapshots,
    transactionsFT,
    transactionsAP,
    transactionsAR,
    activities,
    categories,
    counterparties,
    costCenters,
    toggleSkip,
    setCurrentDate,
    addTransaction,
    updateTransaction,
    updateTransactionStatus,
    addActivity,
    updateActivity,
    deleteActivity,
    fetchData,
  }

  return React.createElement(FinanceContext.Provider, { value }, children)
}

export default function useFinanceStore() {
  const context = useContext(FinanceContext)
  if (!context) throw new Error('useFinanceStore must be used within FinanceProvider')
  return context
}
