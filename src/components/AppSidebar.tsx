import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  ListTodo,
  Lightbulb,
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

export function AppSidebar() {
  const location = useLocation()
  const { toggleSkip } = useFinanceStore()

  const navItems = [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Operacional', url: '/operacional', icon: Wallet },
    { title: 'Lançamentos', url: '/lancamentos', icon: ListTodo },
    { title: 'Contas a Receber', url: '/receber', icon: ArrowUpRight },
    { title: 'Contas a Pagar', url: '/pagar', icon: ArrowDownRight },
    { title: 'Atividades', url: '/atividades', icon: ListTodo },
  ]

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
                className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
              >
                <Lightbulb className="h-4 w-4" />
                <span className="font-medium">SKIP Intelligence</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
