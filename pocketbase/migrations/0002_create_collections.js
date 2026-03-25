migrate(
  (app) => {
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
          collectionId: '_pb_users_auth_',
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
          collectionId: '_pb_users_auth_',
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
          collectionId: '_pb_users_auth_',
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
          collectionId: '_pb_users_auth_',
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
