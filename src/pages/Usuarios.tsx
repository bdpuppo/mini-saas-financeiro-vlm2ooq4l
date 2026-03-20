import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, Profile } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Plus, Loader2, ShieldCheck, Mail } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'

export default function Usuarios() {
  const { profile, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Form state
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) {
      setUsers(data as Profile[])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers()
    }
  }, [profile])

  if (authLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-slate-400" />
      </div>
    )

  // Protect route
  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !email) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)
    const senhaTemporaria = Math.random().toString(36).slice(-8) + 'Aa1!' // Simple random password

    try {
      const { data, error } = await supabase.functions.invoke('enviar-email-confirmacao', {
        body: { email, nome, senha: senhaTemporaria },
      })

      if (error) throw new Error(error.message)
      if (data?.error) throw new Error(data.error)

      toast({
        title: 'Sucesso',
        description: 'Usuário cadastrado. Um e-mail com as credenciais foi enviado.',
      })

      setIsDrawerOpen(false)
      setNome('')
      setEmail('')
      fetchUsers()
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Erro ao criar usuário',
        description: err.message || 'Falha na comunicação com o servidor.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gerenciamento de Usuários
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Controle de acesso e isolamento de dados do sistema.
          </p>
        </div>
        <Button onClick={() => setIsDrawerOpen(true)} className="bg-primary shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Usuários Cadastrados</CardTitle>
          <CardDescription>
            Estes usuários têm acesso isolado aos seus próprios lançamentos e atividades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <Loader2 className="animate-spin h-6 w-6 text-slate-400 mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium text-slate-900">
                        {u.full_name || 'Sem nome'}
                      </TableCell>
                      <TableCell className="text-slate-600">{u.email}</TableCell>
                      <TableCell>
                        {u.role === 'admin' ? (
                          <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">
                            <ShieldCheck className="h-3 w-3 mr-1" /> Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-600">
                            Membro
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {u.is_active ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 hover:bg-green-100"
                          >
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-[400px]">
          <SheetHeader>
            <SheetTitle>Cadastrar Novo Usuário</SheetTitle>
            <SheetDescription>
              Crie uma conta para um novo membro da equipe. A senha será gerada e enviada por e-mail
              automaticamente.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleCreateUser} className="space-y-6 mt-8">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João Silva"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@empresa.com"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-md text-sm text-blue-800">
              <p className="font-semibold mb-1">Sobre as credenciais:</p>
              <p>
                O sistema enviará um e-mail de boas-vindas contendo uma senha segura gerada
                automaticamente.
              </p>
            </div>

            <SheetFooter className="mt-8">
              <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                Cadastrar e Enviar E-mail
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
