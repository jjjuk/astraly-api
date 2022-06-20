import { globals } from './index'

export const initGlobals = (): void => {
  globals.APP_URL = process.env.APP_URL
  globals.PORT = process.env.SERVER_PORT
  globals.HOST = process.env.SERVER_HOST
  globals.DB_HOST = process.env.DB_HOST
  globals.DB_NAME = process.env.DB_NAME
  globals.API_URL = process.env.API_URL
}
