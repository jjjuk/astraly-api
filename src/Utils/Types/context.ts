import Mailer from '../Mail'

export interface AppContext {
  jwtToken: string
  address: string
  id: string
  mailer: Mailer
  queryArgs?: any
}
