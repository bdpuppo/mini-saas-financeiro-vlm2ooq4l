import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { FinanceProvider } from '@/stores/useFinanceStore'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import Operacional from '@/pages/Operacional'
import Lancamentos from '@/pages/Lancamentos'
import Atividades from '@/pages/Atividades'
import NotFound from '@/pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <FinanceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/operacional" element={<Operacional />} />
            <Route path="/lancamentos" element={<Lancamentos />} />
            <Route path="/receber" element={<Lancamentos />} />
            <Route path="/pagar" element={<Lancamentos />} />
            <Route path="/atividades" element={<Atividades />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </FinanceProvider>
  </BrowserRouter>
)

export default App
