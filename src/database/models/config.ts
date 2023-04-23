import * as dotenv from 'dotenv'

dotenv.config()

export const development = {
  url: process.env.DEV_DATABASE_URL,
  dialect: 'postgres',
}

export const production = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
}
