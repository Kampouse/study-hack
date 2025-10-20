import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
export function tursoClient({
  url,
  authToken,
}: {
  url: string | undefined
  authToken: string | undefined
}) {
  if (url?.includes('local')) {
    return drizzle(
      createClient({
        url: 'file:./local.db',
      })
    )
  }
  if (url === undefined) {
    throw new Error('PRIVATE_TURSO_DATABASE_URL is not defined')
  }

  if (authToken === undefined) {
    if (!url.includes('file:')) {
      throw new Error('PRIVATE_TURSO_AUTH_TOKEN is not defined')
    }
  }

  const db = drizzle(
    createClient({
      authToken: authToken,
      url: url,
    })
  )
  return db
}
