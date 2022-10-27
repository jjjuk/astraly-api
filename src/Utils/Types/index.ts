import { mongoose } from '@typegoose/typegoose'

export type ObjectId = mongoose.Schema.Types.ObjectId

export enum ApolloErrors {
  FORBIDDEN = 'FORBIDDEN',
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  NOT_FOUND = 'NOT_FOUND'
}
