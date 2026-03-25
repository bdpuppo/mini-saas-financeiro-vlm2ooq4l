import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
}

interface AuthContextType {
  session: any | null
  profile: Profile | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  requestPasswordReset: (email: string) => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any>(pb.authStore.record)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateAuth = () => {
      setSession(pb.authStore.record)
      if (pb.authStore.record) {
        setProfile({
          id: pb.authStore.record.id,
          email: pb.authStore.record.email,
          full_name: pb.authStore.record.name || 'Usuário',
          role: 'admin',
          is_active: true,
        })
      } else {
        setProfile(null)
      }
      setLoading(false)
    }

    updateAuth()
    const unsubscribe = pb.authStore.onChange(() => updateAuth())

    return () => {
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    pb.authStore.clear()
    return { error: null }
  }

  const requestPasswordReset = async (email: string) => {
    try {
      await pb.collection('users').requestPasswordReset(email)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return (
    <AuthContext.Provider
      value={{ session, profile, signIn, signOut, requestPasswordReset, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
