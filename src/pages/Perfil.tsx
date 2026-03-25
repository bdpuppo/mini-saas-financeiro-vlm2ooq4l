import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'
import { Loader2 } from 'lucide-react'

export default function Perfil() {
  const { profile } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('A nova senha e a confirmação não coincidem.')
      return
    }
    if (newPassword.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${pb.baseUrl}/backend/v1/hash-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      })
      const data = await res.json()

      if (!profile?.id) throw new Error('Usuário não encontrado')

      await pb.collection('users').update(profile.id, {
        oldPassword: currentPassword,
        password: newPassword,
        passwordConfirm: confirmPassword,
        password_hash: data.hash,
      })

      toast.success('Senha atualizada com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar a senha. Verifique a senha atual.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6 mt-10 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Meu Perfil</h1>
        <p className="text-slate-500 text-sm">Gerencie suas informações e segurança da conta.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-5"
      >
        <div className="space-y-1 mb-6 border-b pb-4">
          <p className="text-sm font-medium text-slate-900">
            Nome: <span className="font-normal text-slate-600">{profile?.full_name}</span>
          </p>
          <p className="text-sm font-medium text-slate-900">
            E-mail: <span className="font-normal text-slate-600">{profile?.email}</span>
          </p>
        </div>

        <h2 className="text-lg font-semibold mb-2">Alterar Senha</h2>

        <div className="space-y-2">
          <Label>Senha Atual</Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Nova Senha</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Confirmar Nova Senha</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full mt-6 bg-primary" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Atualizar Senha
        </Button>
      </form>
    </div>
  )
}
