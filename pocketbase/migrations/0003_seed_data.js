migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    let user
    try {
      user = app.findAuthRecordByEmail('_pb_users_auth_', 'brunavia@gmail.com')
    } catch (e) {
      user = new Record(users)
      user.setEmail('brunavia@gmail.com')
      user.setPassword('securepassword123')
      user.setVerified(true)
      user.set('name', 'Administrador')
      app.save(user)
    }

    const dateNow = new Date().toISOString().split('T')[0] + ' 10:00:00.000Z'

    const lancamentos = app.findCollectionByNameOrId('lancamentos')
    const l1 = new Record(lancamentos)
    l1.set('user_id', user.id)
    l1.set('date', dateNow)
    l1.set('type', 'entrada')
    l1.set('amount', 5000)
    l1.set('category', 'Serviços')
    l1.set('description', 'Cliente A')
    l1.set('status', 'realizado')
    app.save(l1)

    const l2 = new Record(lancamentos)
    l2.set('user_id', user.id)
    l2.set('date', dateNow)
    l2.set('type', 'saida')
    l2.set('amount', 1200)
    l2.set('category', 'Infraestrutura')
    l2.set('description', 'Servidores Cloud')
    l2.set('status', 'realizado')
    app.save(l2)

    const contasPagar = app.findCollectionByNameOrId('contas_pagar')
    const cp1 = new Record(contasPagar)
    cp1.set('user_id', user.id)
    cp1.set('due_date', dateNow)
    cp1.set('amount', 850)
    cp1.set('category', 'Marketing')
    cp1.set('description', 'Anúncios Google')
    cp1.set('status', 'previsto')
    app.save(cp1)

    const atividades = app.findCollectionByNameOrId('atividades')
    const a1 = new Record(atividades)
    a1.set('user_id', user.id)
    a1.set('type', 'tarefa')
    a1.set('content', 'Revisar fluxo de caixa do mês')
    a1.set('activity_date', dateNow)
    a1.set('title', 'Revisão Financeira')
    a1.set('status', 'Aguardando')
    a1.set('percentage', 0)
    app.save(a1)
  },
  (app) => {
    // down logic empty for simplicity
  },
)
