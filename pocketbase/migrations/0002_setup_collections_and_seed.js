migrate(
  (app) => {
    const usersId = app.findCollectionByNameOrId('users').id

    const lancamentos = new Collection({
      name: 'lancamentos',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != '' && user_id = @request.auth.id",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'date', type: 'date', required: true },
        { name: 'type', type: 'select', values: ['entrada', 'saida'], required: true },
        { name: 'amount', type: 'number', required: true },
        { name: 'category', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(lancamentos)

    const contas_pagar = new Collection({
      name: 'contas_pagar',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != '' && user_id = @request.auth.id",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'due_date', type: 'date', required: true },
        { name: 'amount', type: 'number', required: true },
        { name: 'category', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'status', type: 'select', values: ['previsto', 'pago', 'cancelado'] },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(contas_pagar)

    const contas_receber = new Collection({
      name: 'contas_receber',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != '' && user_id = @request.auth.id",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'due_date', type: 'date', required: true },
        { name: 'amount', type: 'number', required: true },
        { name: 'category', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'status', type: 'select', values: ['previsto', 'recebido', 'cancelado'] },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(contas_receber)

    const atividades = new Collection({
      name: 'atividades',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != '' && user_id = @request.auth.id",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'type', type: 'text' },
        { name: 'content', type: 'text' },
        { name: 'activity_date', type: 'date' },
        { name: 'title', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'responsible', type: 'text' },
        { name: 'percentage', type: 'number' },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(atividades)

    // SEED DATA
    const users = app.findCollectionByNameOrId('users')
    let user
    try {
      user = app.findAuthRecordByEmail('users', 'brunavia@gmail.com')
    } catch (e) {
      user = new Record(users)
      user.setEmail('brunavia@gmail.com')
      user.setPassword('securepassword123')
      user.setVerified(true)
      user.set('name', 'Administrador')
      user.set('password_hash', 'dummy_hash_for_seed')
      app.save(user)
    }

    const dateNow = new Date().toISOString().split('T')[0] + ' 10:00:00.000Z'

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

    const cp1 = new Record(contas_pagar)
    cp1.set('user_id', user.id)
    cp1.set('due_date', dateNow)
    cp1.set('amount', 850)
    cp1.set('category', 'Marketing')
    cp1.set('description', 'Anúncios Google')
    cp1.set('status', 'previsto')
    app.save(cp1)

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
    try {
      app.delete(app.findCollectionByNameOrId('lancamentos'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('contas_pagar'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('contas_receber'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('atividades'))
    } catch (_) {}
  },
)
