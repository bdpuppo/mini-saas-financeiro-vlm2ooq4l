import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'npm:@supabase/supabase-js'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, nome, senha } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables missing')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { nome, role: 'financeiro' },
    })

    if (authError) throw authError

    // 2. Send email via Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Mini SaaS <onboarding@resend.dev>',
          to: email,
          subject: 'Sua conta foi criada no Mini SaaS!',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #2563eb;">Bem-vindo(a), ${nome}!</h2>
              <p>Sua conta no Mini SaaS Financeiro foi criada com sucesso pelo administrador.</p>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Suas credenciais de acesso:</strong></p>
                <ul style="margin: 0; padding-left: 20px;">
                  <li><strong>E-mail:</strong> ${email}</li>
                  <li><strong>Senha temporária:</strong> ${senha}</li>
                </ul>
              </div>
              <p>Recomendamos que você altere sua senha após o primeiro acesso.</p>
              <br/>
              <p>Atenciosamente,<br/>Equipe do Sistema</p>
            </div>
          `,
        }),
      })

      if (!res.ok) {
        console.error('Failed to send email:', await res.text())
      }
    } else {
      console.log(`[MOCK EMAIL SEND] API KEY NOT CONFIGURED.\nTo: ${email}\nSenha: ${senha}`)
    }

    return new Response(JSON.stringify({ success: true, user: authData.user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
