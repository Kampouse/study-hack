import process from 'node:process'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './drizzle/schema.ts',
  dialect: 'sqlite',
  out: './drizzle/migrations/',
  dbCredentials:
    process.env.PRIVATE_TURSO_DATABASE_URL &&
    process.env.PRIVATE_TURSO_ACCOUNT_ID &&
    process.env.PRIVATE_TURSO_DATABASE_ID &&
    process.env.PRIVATE_TURSO_AUTH_TOKEN
      ? {
          accountId: process.env.PRIVATE_TURSO_ACCOUNT_ID,
          databaseId: process.env.PRIVATE_TURSO_DATABASE_ID,
          token: process.env.PRIVATE_TURSO_AUTH_TOKEN,
        }
      : {
          url: 'file:local.db',
        },
})
