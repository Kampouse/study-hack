import process from 'node:process'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './drizzle/schema.ts',
  dialect: 'sqlite',
  out: './drizzle/migrations/',
  driver: 'turso',
  dbCredentials: {
    authToken: process.env.PRIVATE_TURSO_AUTH_TOKEN,
    url: 'local.db',
  },
})
