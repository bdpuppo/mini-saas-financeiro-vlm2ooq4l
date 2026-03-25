import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { createUser } from '@/services/skipCloudService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()

  const initialTab = location.pathname === '/cadastro' ? 'register' : 'login'
  const [activeTab, setActiveTab] = useState(initialTab)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRetry, setShowRetry] = useState(false)

  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [isForgotLoading, setIsForgotLoading] = useState(false)

  // Validation States
  const [nameTouched, setNameTouched] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  const [nameErrorMsg, setNameErrorMsg] = useState('')
  const [emailErrorMsg, setEmailErrorMsg] = useState('')
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('')

  const { signIn, session, loading, requestPasswordReset } = useAuth()

  useEffect(() => {
    const tab = location.pathname === '/cadastro' ? 'register' : 'login'
    setActiveTab(tab)
    setShowForgot(false)
  }, [location.pathname])

  const validateName = (val: string) => {
    if (!val) return 'Campo obrigatório'
    if (val.length < 3 || val.length > 100) return 'O nome deve ter entre 3 e 100 caracteres'
    return ''
  }

  const validateEmail = (val: string) => {
    if (!val) return 'Campo obrigatório'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Email inválido'
    return ''
  }

  const validatePassword = (val: string) => {
    if (!val) return 'Campo obrigatório'
    if (val.length < 8 || !/[A-Z]/.test(val) || !/[0-9]/.test(val)) {
      return 'A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número'
    }
    return ''
  }

  useEffect(() => {
    if (nameTouched) setNameErrorMsg(validateName(name))
  }, [name, nameTouched])

  useEffect(() => {
    if (emailTouched) setEmailErrorMsg(validateEmail(email))
  }, [email, emailTouched])

  useEffect(() => {
    if (passwordTouched) setPasswordErrorMsg(validatePassword(password))
  }, [password, passwordTouched])

  const isFormValid = !validateName(name) && !validateEmail(email) && !validatePassword(password)

  const handleTabChange = (val: string) => {
    setActiveTab(val)
    setShowForgot(false)
    if (val === 'register') {
      navigate('/cadastro', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin h-8 w-8 text-slate-400" />
      </div>
    )
  }

  if (session) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const { error } = await signIn(email, password)
    setIsSubmitting(false)
    if (error) {
      toast.error('Verifique suas credenciais.', {
        description: 'Erro ao entrar.',
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)
    setShowRetry(false)

    try {
      await createUser({ name, email, password })
      toast.success('Cadastro realizado com sucesso!')

      setTimeout(() => {
        handleTabChange('login')
        setName('')
        setEmail('')
        setPassword('')
        setNameTouched(false)
        setEmailTouched(false)
        setPasswordTouched(false)
        setNameErrorMsg('')
        setEmailErrorMsg('')
        setPasswordErrorMsg('')
      }, 2000)
    } catch (error: any) {
      if (error.message === 'conflict_email') {
        setEmailErrorMsg('Este email já está cadastrado')
      } else {
        toast.error('Erro ao criar conta. Tente novamente.')
        setShowRetry(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail) return
    setIsForgotLoading(true)
    try {
      await requestPasswordReset(forgotEmail)
      toast.success('Email enviado', { description: 'Instruções enviadas para seu e-mail.' })
      setShowForgot(false)
    } catch (e) {
      toast.error('Falha ao solicitar redefinição.')
    } finally {
      setIsForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 animate-fade-in">
      <Card className="w-full max-w-sm border-slate-200 shadow-md">
        <CardHeader className="text-center space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-slate-900">Mini SaaS Financeiro</CardTitle>
          <CardDescription className="text-slate-500">
            Acesse ou crie sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar Conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              {showForgot ? (
                <form onSubmit={handleForgotPass} className="space-y-4 animate-in fade-in">
                  <p className="text-sm text-slate-500 text-center mb-4">
                    Informe seu e-mail para receber um link de redefinição de senha.
                  </p>
                  <Input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="E-mail"
                    className="bg-white"
                  />
                  <div className="space-y-2 mt-4">
                    <Button type="submit" className="w-full" disabled={isForgotLoading}>
                      {isForgotLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{' '}
                      Enviar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowForgot(false)}
                    >
                      Voltar
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="E-mail"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Senha"
                      className="bg-white"
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 text-xs text-primary h-auto py-1"
                      onClick={() => setShowForgot(true)}
                    >
                      Esqueci a Senha
                    </Button>
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Entrar
                  </Button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setNameTouched(true)}
                    placeholder="Nome completo"
                    className={cn('bg-white transition-colors', nameErrorMsg && 'border-red-500')}
                    disabled={isSubmitting}
                  />
                  {nameErrorMsg && (
                    <p className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
                      {nameErrorMsg}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="E-mail"
                    className={cn('bg-white transition-colors', emailErrorMsg && 'border-red-500')}
                    disabled={isSubmitting}
                  />
                  {emailErrorMsg && (
                    <p className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
                      {emailErrorMsg}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="Senha"
                    className={cn(
                      'bg-white transition-colors',
                      passwordErrorMsg && 'border-red-500',
                    )}
                    disabled={isSubmitting}
                  />
                  {passwordErrorMsg && (
                    <p className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
                      {passwordErrorMsg}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Criando conta...
                    </>
                  ) : showRetry ? (
                    'Tentar novamente'
                  ) : (
                    'Criar Conta'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
