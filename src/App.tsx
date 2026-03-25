import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { FinanceProvider } from '@/stores/useFinanceStore'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import Operacional from '@/pages/Operacional'
import Lancamentos from '@/pages/Lancamentos'
import Atividades from '@/pages/Atividades'
import Usuarios from '@/pages/Usuarios'
import NotFound from '@/pages/NotFound'
import Login from '@/pages/Login'
import Perfil from '@/pages/Perfil'
import { Loader2 } from 'lucide-react'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth()
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-slate-400" />
      </div>
    )
  if (!session) return <Navigate to="/login" replace />
  return <>{children}</>
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Index />} />
        <Route path="/operacional" element={<Operacional />} />
        <Route path="/lancamentos" element={<Lancamentos />} />
        <Route path="/receber" element={<Lancamentos />} />
        <Route path="/pagar" element={<Lancamentos />} />
        <Route path="/atividades" element={<Atividades />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <FinanceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </FinanceProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
