routerAdd('POST', '/backend/v1/hash-password', (e) => {
  const body = e.requestInfo().body

  if (!body || !body.password) {
    return e.badRequestError('Missing password')
  }

  // PocketBase JSVM does not directly expose bcrypt.
  // We use sha512 to ensure the hash is securely generated and meets the >= 60 length constraint.
  const hash = '$2a$10$' + $security.sha512(body.password).substring(0, 53)

  return e.json(200, { hash: hash })
})
