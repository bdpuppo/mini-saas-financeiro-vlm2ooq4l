// Service to handle operations with Skip Cloud (PocketBase)
// Replaced Supabase with PocketBase API calls for users as per requirements

const SKIP_CLOUD_DB_URL =
  import.meta.env.VITE_SKIP_CLOUD_DB_URL || (import.meta.env.VITE_POCKETBASE_URL as string)
const SKIP_CLOUD_DB_KEY = import.meta.env.VITE_SKIP_CLOUD_DB_KEY as string

export interface SkipCloudUser {
  id: string
  email: string
  password_hash: string
  name: string
  user_id: string | null
  created_at: string
  updated_at: string
}

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (SKIP_CLOUD_DB_KEY) {
    headers['Authorization'] = `Bearer ${SKIP_CLOUD_DB_KEY}`
  }
  return headers
}

export async function createUser(
  user: { name: string; email: string; password: string },
  retries = 3,
): Promise<SkipCloudUser | null> {
  const delays = [2000, 4000, 8000]

  for (let i = 0; i < retries; i++) {
    try {
      // 1. Hash the password via our custom backend hook
      const hashRes = await fetch(`${SKIP_CLOUD_DB_URL}/backend/v1/hash-password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ password: user.password }),
      })

      if (!hashRes.ok) {
        throw new Error('hash_error')
      }
      const hashData = await hashRes.json()

      // 2. Create the user in the PocketBase auth collection
      const createRes = await fetch(`${SKIP_CLOUD_DB_URL}/api/collections/users/records`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          passwordConfirm: user.password,
          name: user.name,
          password_hash: hashData.hash,
        }),
      })

      if (!createRes.ok) {
        const errorData = await createRes.json()
        if (createRes.status === 400 && errorData?.data?.email?.code === 'validation_not_unique') {
          throw new Error('conflict_email')
        }
        throw new Error('create_error')
      }

      const record = await createRes.json()

      return {
        id: record.id,
        email: record.email,
        password_hash: record.password_hash,
        name: record.name,
        user_id: record.id,
        created_at: record.created,
        updated_at: record.updated,
      }
    } catch (error: any) {
      if (error.message === 'conflict_email') {
        throw error
      }

      // Network or generic server error, apply exponential backoff
      if (i < retries - 1) {
        await new Promise((res) => setTimeout(res, delays[i]))
        continue
      }
      throw error
    }
  }

  return null
}

export async function getUserByEmail(email: string): Promise<SkipCloudUser | null> {
  try {
    const response = await fetch(
      `${SKIP_CLOUD_DB_URL}/api/collections/users/records?filter=(email='${encodeURIComponent(email)}')`,
      {
        method: 'GET',
        headers: getHeaders(),
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data?.items?.[0] || null
  } catch (error) {
    console.error('Skip Cloud Connection Error (getUserByEmail):', error)
    throw new Error('Erro ao conectar ao banco de dados')
  }
}

export async function getUserById(id: string): Promise<SkipCloudUser | null> {
  try {
    const response = await fetch(
      `${SKIP_CLOUD_DB_URL}/api/collections/users/records/${encodeURIComponent(id)}`,
      {
        method: 'GET',
        headers: getHeaders(),
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Skip Cloud Connection Error (getUserById):', error)
    throw new Error('Erro ao conectar ao banco de dados')
  }
}

export async function updateUser(
  id: string,
  updates: Partial<SkipCloudUser>,
): Promise<SkipCloudUser | null> {
  try {
    const response = await fetch(
      `${SKIP_CLOUD_DB_URL}/api/collections/users/records/${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Skip Cloud Connection Error (updateUser):', error)
    throw new Error('Erro ao conectar ao banco de dados')
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${SKIP_CLOUD_DB_URL}/api/collections/users/records/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Skip Cloud Connection Error (deleteUser):', error)
    throw new Error('Erro ao conectar ao banco de dados')
  }
}
