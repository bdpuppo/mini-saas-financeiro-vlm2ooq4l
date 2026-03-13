import { Bell, Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import useFinanceStore from '@/stores/useFinanceStore'

export function Header() {
  const { toggleSkip } = useFinanceStore()

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar lançamentos..."
            className="pl-8 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSkip}
          className="border-primary text-primary hover:bg-primary/10 hidden sm:flex"
        >
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          SKIP Ativo
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
        </Button>
        <div className="flex items-center gap-2 border-l pl-4 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">Diretoria</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <Button variant="secondary" size="icon" className="rounded-full">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
