migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('users')
    if (!col.fields.getByName('password_hash')) {
      col.fields.add(
        new TextField({
          name: 'password_hash',
          required: true,
          min: 60,
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('users')
    col.fields.removeByName('password_hash')
    app.save(col)
  },
)
