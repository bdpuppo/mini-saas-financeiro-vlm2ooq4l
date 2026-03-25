migrate(
  (app) => {
    const usersId = app.findCollectionByNameOrId('users').id

    const collection = new Collection({
      name: 'contas_pagar',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: 'user_id = @request.auth.id',
      updateRule: 'user_id = @request.auth.id',
      deleteRule: 'user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'data', type: 'date', required: true },
        { name: 'favorecido', type: 'text', required: true },
        { name: 'categoria', type: 'text', required: true },
        { name: 'descricao', type: 'text' },
        { name: 'valor', type: 'number', required: true },
        { name: 'status', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_contas_pagar_user_id ON contas_pagar (user_id)'],
    })

    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('contas_pagar')
      app.delete(collection)
    } catch (_) {}
  },
)
