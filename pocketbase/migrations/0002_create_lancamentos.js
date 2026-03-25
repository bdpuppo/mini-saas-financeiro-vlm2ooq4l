migrate(
  (app) => {
    const usersId = app.findCollectionByNameOrId('users').id

    const collection = new Collection({
      name: 'lancamentos',
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
        { name: 'descricao', type: 'text' },
        { name: 'categoria', type: 'text' },
        { name: 'valor', type: 'number', required: true },
        { name: 'tipo', type: 'select', values: ['entrada', 'saida'], required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_lancamentos_user_id ON lancamentos (user_id)'],
    })

    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('lancamentos')
      app.delete(collection)
    } catch (_) {}
  },
)
