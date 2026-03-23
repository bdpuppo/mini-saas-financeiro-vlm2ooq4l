// Service to handle operations with Skip Cloud
// Replacing Supabase for user operations (Phase 1)

const SKIP_CLOUD_DB_URL = import.meta.env.VITE_SKIP_CLOUD_DB_URL as string
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

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${SKIP_CLOUD_DB_KEY}`,
  apikey: SKIP_CLOUD_DB_KEY,
})

export async function createUser(user: Partial<SkipCloudUser>): Promise<SkipCloudUser | null> {
  try {
    const response = await fetch(`${SKIP_CLOUD_DB_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Prefer: 'return=representation',
      },
      body: JSON.stringify(user),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data?.[0] || null
  } catch (error) {
    console.error('Skip Cloud Connection Error (createUser):', error)
    throw new Error('Erro ao conectar ao banco de dados')
  }
}

export async function getUserByEmail(email: string): Promise<SkipCloudUser | null> {
  try {
    const response = await fetch(
      `${SKIP_CLOUD_DB_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: getHeaders(),
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data?.[0] || null
  } catch (error) {
    console.error('Skip Cloud Connection Error (getUserByEmail):', error)
    throw new Error('Erro ao conectar ao banco de dados')
  }
}

export async function getUserById(id: string): Promise<SkipCloudUser | null> {
  try {
    const response = await fetch(
      `${SKIP_CLOUD_DB_URL}/rest/v1/users?id=eq.${encodeURIComponent(id)}`,
      {
        method: 'GET',
        headers: getHeaders(),
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data?.[0] || null
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
      `${SKIP_CLOUD_DB_URL}/rest/v1/users?id=eq.${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          Prefer: 'return=representation',
        },
        body: JSON.stringify(updates),
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data?.[0] || null
  } catch (error) {
    console.error('Skip Cloud Connection Error (updateUser):', error)
    throw new Error('Erro ao conectar ao banco de dados')
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${SKIP_CLOUD_DB_URL}/rest/v1/users?id=eq.${encodeURIComponent(id)}`,
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
