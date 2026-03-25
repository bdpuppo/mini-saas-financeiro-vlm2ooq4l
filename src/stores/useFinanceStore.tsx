import React, { createContext, useContext, useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { toast } from '@/hooks/use-toast'
import { normalizeString, extractDate } from '@/utils/formatters'

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
  type?: string
  content?: string
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
  fetchData: (background?: boolean) => Promise<void>
}

export const FinanceContext = createContext<FinanceStoreContext | null>(null)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSkipOpen, setIsSkipOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(extractDate(new Date().toISOString()))

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

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((token, record) => {
      if (record) fetchData()
      else {
        setTransactionsFT([])
        setTransactionsAP([])
        setTransactionsAR([])
        setActivities([])
      }
    })

    if (pb.authStore.record) fetchData()

    return () => unsubscribe()
  }, [])

  const calculateSummaries = (
    ft: Transaction[],
    ap: Transaction[],
    ar: Transaction[],
    act: Activity[],
  ) => {
    const summaryMap = new Map<string, any>()

    const ensureMonth = (dateStr: string) => {
      if (!dateStr) return null
      const month = dateStr.substring(0, 7) + '-01'
      if (!summaryMap.has(month)) {
        summaryMap.set(month, {
          reference_date: month,
          entrada_realizada: 0,
          saida_realizada: 0,
          entrada_prevista: 0,
          saida_prevista: 0,
        })
      }
      return summaryMap.get(month)
    }

    ft.forEach((t) => {
      const s = ensureMonth(t.date)
      if (s && t.status === 'realizado') {
        if (t.type === 'entrada') s.entrada_realizada += t.amount
        else s.saida_realizada += t.amount
      }
    })

    ar.forEach((t) => {
      const s = ensureMonth(t.date)
      if (s && (t.status === 'previsto' || t.status === 'recebido')) {
        if (t.status === 'previsto') s.entrada_prevista += t.amount
        else s.entrada_realizada += t.amount
      }
    })

    ap.forEach((t) => {
      const s = ensureMonth(t.date)
      if (s && (t.status === 'previsto' || t.status === 'pago')) {
        if (t.status === 'previsto') s.saida_prevista += t.amount
        else s.saida_realizada += t.amount
      }
    })

    setFinancialSummary(Array.from(summaryMap.values()))
    setCashflowSnapshots(Array.from(summaryMap.values()))
    setCashBreakpoint({ rupture_date: null, risk_level: 'Seguro' })
    setActivitySummary([])
    setExpensesByCategory([])

    const cats = Array.from(
      new Set([...ft, ...ap, ...ar].map((t) => t.category).filter(Boolean)),
    ).map((name, i) => ({ id: i.toString(), name }))
    const ents = Array.from(
      new Set([...ft, ...ap, ...ar].map((t) => t.entity).filter(Boolean)),
    ).map((name, i) => ({ id: i.toString(), name }))

    setCategories(cats)
    setCounterparties(ents)
  }

  const fetchData = async (background = false) => {
    if (!background) setIsLoading(true)
    try {
      const userId = pb.authStore.record?.id
      if (!userId) return

      const filter = `user_id="${userId}"`

      const [resFinTx, resAp, resAr, resAct] = await Promise.all([
        pb.collection('lancamentos').getFullList({ filter, sort: '-date' }),
        pb.collection('contas_pagar').getFullList({ filter, sort: '-due_date' }),
        pb.collection('contas_receber').getFullList({ filter, sort: '-due_date' }),
        pb.collection('atividades').getFullList({ filter, sort: '-activity_date' }),
      ])

      const mappedFT = resFinTx.map(
        (t: any): Transaction => ({
          id: t.id,
          date: extractDate(t.date),
          type: t.type || (t.amount >= 0 ? 'entrada' : 'saida'),
          status: t.status || 'realizado',
          amount: Number(t.amount),
          entity: t.description?.split(' ')[0] || 'Desconhecido',
          description: t.description || '',
          category: t.category || 'Sem Categoria',
          costCenter: 'Geral',
          rawSource: 'ft',
        }),
      )

      const mappedAP = resAp.map(
        (t: any): Transaction => ({
          id: t.id,
          date: extractDate(t.due_date),
          type: 'saida',
          status: t.status || 'previsto',
          amount: Number(t.amount),
          entity: t.description?.split(' ')[0] || 'Desconhecido',
          description: t.description || '',
          category: t.category || 'Sem Categoria',
          costCenter: 'Geral',
          rawSource: 'ap',
        }),
      )

      const mappedAR = resAr.map(
        (t: any): Transaction => ({
          id: t.id,
          date: extractDate(t.due_date),
          type: 'entrada',
          status: t.status || 'previsto',
          amount: Number(t.amount),
          entity: t.description?.split(' ')[0] || 'Desconhecido',
          description: t.description || '',
          category: t.category || 'Sem Categoria',
          costCenter: 'Geral',
          rawSource: 'ar',
        }),
      )

      const mappedAct = resAct.map(
        (t: any): Activity => ({
          id: t.id,
          activity_date: extractDate(t.activity_date || t.created),
          title: t.title || t.content || 'Atividade',
          status: t.status || 'OK',
          responsible: t.responsible || '',
          percentage: t.percentage || 0,
          notes: t.notes || '',
          type: t.type,
          content: t.content,
        }),
      )

      setTransactionsFT(mappedFT)
      setTransactionsAP(mappedAP)
      setTransactionsAR(mappedAR)
      setActivities(mappedAct)

      calculateSummaries(mappedFT, mappedAP, mappedAR, mappedAct)
    } catch (err) {
      console.error('Error fetching data:', err)
      toast({ title: 'Erro', description: 'Falha ao carregar dados.', variant: 'destructive' })
    } finally {
      if (!background) setIsLoading(false)
    }
  }

  const toggleSkip = () => setIsSkipOpen(!isSkipOpen)

  const addTransaction = async (t: any) => {
    setIsLoading(true)
    try {
      const userId = pb.authStore.record?.id
      if (!userId) throw new Error('User not logged in')

      let table = 'lancamentos'
      let payload: any = {
        user_id: userId,
        amount: t.amount,
        category: t.category || 'Geral',
        description: t.description || t.entity || '',
      }

      if (t.status === 'previsto') {
        if (t.type === 'entrada') {
          table = 'contas_receber'
          payload.due_date = t.date + ' 12:00:00.000Z'
          payload.status = 'previsto'
        } else {
          table = 'contas_pagar'
          payload.due_date = t.date + ' 12:00:00.000Z'
          payload.status = 'previsto'
        }
      } else {
        table = 'lancamentos'
        payload.date = t.date + ' 12:00:00.000Z'
        payload.type = t.type
        payload.status = 'realizado'
      }

      await pb.collection(table).create(payload)
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
      let table =
        rawSource === 'ap' ? 'contas_pagar' : rawSource === 'ar' ? 'contas_receber' : 'lancamentos'
      let payload: any = { amount: t.amount, category: t.category, description: t.description }

      if (rawSource === 'ap' || rawSource === 'ar') {
        payload.due_date = t.date + ' 12:00:00.000Z'
        payload.status = t.status
      } else {
        payload.date = t.date + ' 12:00:00.000Z'
        payload.type = t.type
        payload.status = t.status
      }

      await pb.collection(table).update(id, payload)
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
      rawSource === 'ap' ? 'contas_pagar' : rawSource === 'ar' ? 'contas_receber' : 'lancamentos'
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

    try {
      await pb.collection(table).update(id, { status: finalStatus })
      await fetchData()
    } catch (e) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      })
    }
  }

  const addActivity = async (payload: Partial<Activity>) => {
    setIsLoading(true)
    try {
      const userId = pb.authStore.record?.id
      if (!userId) throw new Error('User not logged in')

      await pb.collection('atividades').create({
        user_id: userId,
        activity_date:
          (payload.activity_date || new Date().toISOString().split('T')[0]) + ' 12:00:00.000Z',
        title: payload.title || 'Nova Atividade',
        status: payload.status || 'OK',
        responsible: payload.responsible || '',
        percentage: payload.percentage || 0,
        notes: payload.notes || '',
        type: payload.type || 'tarefa',
        content: payload.content || '',
      })
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
    try {
      await pb.collection('atividades').update(id, partial)
      toast({ title: 'Sucesso', description: 'Atividade atualizada.', variant: 'default' })
      await fetchData(true)
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro', description: 'Falha ao atualizar atividade.', variant: 'destructive' })
      throw err
    }
  }

  const deleteActivity = async (id: string) => {
    setIsLoading(true)
    try {
      await pb.collection('atividades').delete(id)
      await fetchData()
      toast({ title: 'Sucesso', description: 'Atividade excluída.', variant: 'default' })
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
