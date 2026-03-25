import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import pb from '@/lib/pocketbase/client'
import { toast } from 'sonner'
import { extractDate } from '@/utils/formatters'
import { useRealtime } from '@/hooks/use-realtime'

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
export type ActivityStatus = 'OK' | 'Andamento' | 'Aguardando' | 'Parado' | string

export interface Transaction {
  id: string
  date: string
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
  addTransaction: (t: any, skipFetch?: boolean) => Promise<void>
  updateTransaction: (id: string, partial: any, rawSource?: string) => Promise<void>
  updateTransactionStatus: (id: string, status: string, rawSource?: string) => Promise<void>
  addActivity: (partial: Partial<Activity>, skipFetch?: boolean) => Promise<void>
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

  const calculateSummaries = useCallback(
    (ft: Transaction[], ap: Transaction[], ar: Transaction[], act: Activity[]) => {
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
    },
    [],
  )

  const fetchData = useCallback(
    async (background = false) => {
      const userId = pb.authStore.record?.id
      if (!userId) return

      if (!background) setIsLoading(true)
      try {
        const filter = `user_id="${userId}"`

        const [resFinTx, resAp, resAr, resAct] = await Promise.all([
          pb.collection('lancamentos').getFullList({ filter, sort: '-data' }),
          pb.collection('contas_pagar').getFullList({ filter, sort: '-data' }),
          pb.collection('contas_receber').getFullList({ filter, sort: '-data' }),
          pb.collection('atividades').getFullList({ filter, sort: '-data' }),
        ])

        const mappedFT = resFinTx.map(
          (t: any): Transaction => ({
            id: t.id,
            date: extractDate(t.data),
            type: t.tipo as TransactionType,
            status: 'realizado',
            amount: Number(t.valor),
            entity: t.descricao?.split(' ')[0] || 'Desconhecido',
            description: t.descricao || '',
            category: t.categoria || 'Sem Categoria',
            costCenter: 'Geral',
            rawSource: 'ft',
          }),
        )

        const mappedAP = resAp.map(
          (t: any): Transaction => ({
            id: t.id,
            date: extractDate(t.data),
            type: 'saida',
            status: t.status || 'previsto',
            amount: Number(t.valor),
            entity: t.favorecido || t.descricao?.split(' ')[0] || 'Desconhecido',
            description: t.descricao || '',
            category: t.categoria || 'Sem Categoria',
            costCenter: 'Geral',
            rawSource: 'ap',
          }),
        )

        const mappedAR = resAr.map(
          (t: any): Transaction => ({
            id: t.id,
            date: extractDate(t.data),
            type: 'entrada',
            status: t.status || 'previsto',
            amount: Number(t.valor),
            entity: t.cliente || t.descricao?.split(' ')[0] || 'Desconhecido',
            description: t.descricao || '',
            category: t.categoria || 'Sem Categoria',
            costCenter: 'Geral',
            rawSource: 'ar',
          }),
        )

        const mappedAct = resAct.map(
          (t: any): Activity => ({
            id: t.id,
            activity_date: extractDate(t.data),
            title: t.descricao || 'Atividade',
            status: t.status || 'OK',
            responsible: t.responsavel || '',
          }),
        )

        setTransactionsFT(mappedFT)
        setTransactionsAP(mappedAP)
        setTransactionsAR(mappedAR)
        setActivities(mappedAct)

        calculateSummaries(mappedFT, mappedAP, mappedAR, mappedAct)
      } catch (err) {
        console.error('Error fetching data:', err)
        toast.error('Falha ao carregar dados.')
      } finally {
        if (!background) setIsLoading(false)
      }
    },
    [calculateSummaries],
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useRealtime('lancamentos', () => fetchData(true))
  useRealtime('contas_pagar', () => fetchData(true))
  useRealtime('contas_receber', () => fetchData(true))
  useRealtime('atividades', () => fetchData(true))

  const toggleSkip = () => setIsSkipOpen(!isSkipOpen)

  const addTransaction = async (t: any, skipFetch = false) => {
    if (!skipFetch) setIsLoading(true)
    try {
      const userId = pb.authStore.record?.id
      if (!userId) throw new Error('User not logged in')

      let table = 'lancamentos'
      let payload: any = {
        user_id: userId,
        valor: t.amount,
        categoria: t.category || 'Geral',
      }

      if (t.status === 'previsto') {
        if (t.type === 'entrada') {
          table = 'contas_receber'
          payload.data = t.date + ' 12:00:00.000Z'
          payload.cliente = t.entity || 'Desconhecido'
          payload.descricao = t.description || ''
          payload.status = 'previsto'
        } else {
          table = 'contas_pagar'
          payload.data = t.date + ' 12:00:00.000Z'
          payload.favorecido = t.entity || 'Desconhecido'
          payload.descricao = t.description || ''
          payload.status = 'previsto'
        }
      } else {
        table = 'lancamentos'
        payload.data = t.date + ' 12:00:00.000Z'
        payload.descricao =
          t.entity && t.description
            ? `${t.entity} - ${t.description}`
            : t.description || t.entity || 'Sem descrição'
        payload.tipo = t.type
      }

      await pb.collection(table).create(payload)
      if (!skipFetch) await fetchData(true)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      if (!skipFetch) setIsLoading(false)
    }
  }

  const updateTransaction = async (id: string, t: any, rawSource?: string) => {
    setIsLoading(true)
    try {
      let table = 'lancamentos'
      let payload: any = { valor: t.amount, categoria: t.category }

      if (rawSource === 'ap') {
        table = 'contas_pagar'
        payload.data = t.date + ' 12:00:00.000Z'
        payload.favorecido = t.entity
        payload.descricao = t.description
        payload.status = t.status
      } else if (rawSource === 'ar') {
        table = 'contas_receber'
        payload.data = t.date + ' 12:00:00.000Z'
        payload.cliente = t.entity
        payload.descricao = t.description
        payload.status = t.status
      } else {
        table = 'lancamentos'
        payload.data = t.date + ' 12:00:00.000Z'
        payload.descricao =
          t.entity && t.description
            ? `${t.entity} - ${t.description}`
            : t.description || t.entity || 'Sem descrição'
        payload.tipo = t.type
      }

      await pb.collection(table).update(id, payload)
      await fetchData(true)
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
    if (table === 'lancamentos') return

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
      await fetchData(true)
    } catch (e) {
      toast.error('Não foi possível atualizar o status.')
    }
  }

  const addActivity = async (payload: Partial<Activity>, skipFetch = false) => {
    if (!skipFetch) setIsLoading(true)
    try {
      const userId = pb.authStore.record?.id
      if (!userId) throw new Error('User not logged in')

      await pb.collection('atividades').create({
        user_id: userId,
        data: (payload.activity_date || new Date().toISOString().split('T')[0]) + ' 12:00:00.000Z',
        descricao: payload.title || 'Nova Atividade',
        status: payload.status || 'Aguardando',
        responsavel: payload.responsible || '',
      })
      if (!skipFetch) await fetchData(true)
    } catch (err) {
      console.error(err)
      if (!skipFetch) toast.error('Falha ao adicionar atividade.')
      throw err
    } finally {
      if (!skipFetch) setIsLoading(false)
    }
  }

  const updateActivity = async (id: string, partial: Partial<Activity>) => {
    try {
      await pb.collection('atividades').update(id, {
        data: partial.activity_date ? partial.activity_date + ' 12:00:00.000Z' : undefined,
        descricao: partial.title,
        status: partial.status,
        responsavel: partial.responsible,
      })
      toast.success('Atividade atualizada.')
      await fetchData(true)
    } catch (err) {
      console.error(err)
      toast.error('Falha ao atualizar atividade.')
      throw err
    }
  }

  const deleteActivity = async (id: string) => {
    setIsLoading(true)
    try {
      await pb.collection('atividades').delete(id)
      await fetchData(true)
      toast.success('Atividade excluída.')
    } catch (err) {
      console.error(err)
      toast.error('Falha ao excluir atividade.')
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
