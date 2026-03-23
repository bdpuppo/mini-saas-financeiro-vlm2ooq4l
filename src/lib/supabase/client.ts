import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

const isSupabaseConfigured = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY

const createMockSupabaseClient = () => {
  console.warn('Supabase URL or Key is missing. Using mock client for Skip Cloud migration.')

  const createMockChain = (): any => {
    const fn = () => mockChain
    const mockChain = new Proxy(fn, {
      get: (target, prop) => {
        if (prop === 'then') {
          return (onFulfilled?: any, onRejected?: any) =>
            Promise.resolve({ data: null, error: null }).then(onFulfilled, onRejected)
        }
        if (prop === 'catch') {
          return (onRejected?: any) =>
            Promise.resolve({ data: null, error: null }).catch(onRejected)
        }
        if (prop === 'finally') {
          return (onFinally?: any) =>
            Promise.resolve({ data: null, error: null }).finally(onFinally)
        }
        if (prop === 'unsubscribe') {
          return () => {}
        }
        return mockChain
      },
      apply: () => mockChain,
    })
    return mockChain
  }

  const mockSession = { user: { id: 'mock-user-id', email: 'mock@example.com' } }

  return {
    auth: {
      onAuthStateChange: (callback: any) => {
        setTimeout(() => callback('SIGNED_IN', mockSession), 0)
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      getSession: async () => ({ data: { session: mockSession }, error: null }),
      signUp: async () => ({ data: null, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: createMockChain(),
    functions: {
      invoke: async () => ({ data: null, error: null }),
    },
  } as any
}

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";

export const supabase = isSupabaseConfigured
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createMockSupabaseClient()
