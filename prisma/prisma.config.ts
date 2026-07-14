import { defineConfig } from '@prisma/config'

export default defineConfig({
  earlyAccess: true,
  migrations: {
    seed: 'npx ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})