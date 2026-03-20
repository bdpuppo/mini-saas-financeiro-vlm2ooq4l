import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  ListTodo,
  Lightbulb,
  Users,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import useFinanceStore from '@/stores/useFinanceStore'
import { useAuth } from '@/hooks/use-auth'

export function AppSidebar() {
  const location = useLocation()
  const { toggleSkip } = useFinanceStore()
  const { profile, signOut } = useAuth()

  const navItems = [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Operacional', url: '/operacional', icon: Wallet },
    { title: 'Lançamentos', url: '/lancamentos', icon: ListTodo },
    { title: 'Contas a Receber', url: '/receber', icon: ArrowUpRight },
    { title: 'Contas a Pagar', url: '/pagar', icon: ArrowDownRight },
    { title: 'Atividades', url: '/atividades', icon: ListTodo },
  ]

  if (profile?.role === 'admin') {
    navItems.push({ title: 'Usuários', url: '/usuarios', icon: Users })
  }

  return (
    <Sidebar variant="sidebar" className="border-r-0">
      <SidebarHeader className="p-4 py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center font-bold text-primary-foreground">
            PR
          </div>
          <span className="font-bold text-lg tracking-tight">Porto Real</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs">
            Visões
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={toggleSkip}
                className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary mb-2"
              >
                <Lightbulb className="h-4 w-4" />
                <span className="font-medium">SKIP Intelligence</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => signOut()}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
