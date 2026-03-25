import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, Profile } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { toast } from 'sonner'
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
import { createUser } from '@/services/skipCloudService'

export default function Usuarios() {
  const { profile, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const records = await pb.collection('users').getFullList({ sort: '-created' })
      const mapped = records.map((u) => ({
        id: u.id,
        email: u.email,
        full_name: u.name,
        role: 'membro',
        is_active: u.verified,
      }))
      setUsers(mapped as Profile[])
    } catch (e) {
      console.error(e)
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

  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !email) {
      toast.error('Preencha todos os campos.')
      return
    }

    setIsSubmitting(true)
    const senhaTemporaria = 'Senha123'

    try {
      await createUser({ name: nome, email, password: senhaTemporaria })

      toast.success(`Usuário cadastrado com a senha padrão: ${senhaTemporaria}`, {
        duration: 10000,
      })

      setIsDrawerOpen(false)
      setNome('')
      setEmail('')
      fetchUsers()
    } catch (err: any) {
      toast.error(
        err.message === 'conflict_email'
          ? 'Este email já está em uso.'
          : 'Falha na comunicação com o servidor.',
      )
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <Loader2 className="animate-spin h-6 w-6 text-slate-400 mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-slate-500">
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
              Crie uma conta isolada para um novo membro da equipe. A senha inicial será configurada
              como "Senha123".
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
              <p className="font-semibold mb-1">Sobre o isolamento de dados:</p>
              <p>
                Os lançamentos, contas e atividades criadas por este usuário ficarão restritos e
                acessíveis apenas por ele, garantindo total privacidade.
              </p>
            </div>

            <SheetFooter className="mt-8">
              <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                Cadastrar Usuário
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
