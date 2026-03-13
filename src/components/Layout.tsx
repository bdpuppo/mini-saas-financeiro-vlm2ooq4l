import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'
import { SkipPanel } from './SkipPanel'

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen bg-slate-50/50">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
      <SkipPanel />
    </SidebarProvider>
  )
}
