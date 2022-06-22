import { buildSchema as tsBuildSchema } from 'type-graphql'
import { GraphQLSchema } from 'graphql'
import { AccountResolvers } from '../Repository/Account/Account.Resolvers'
import { appAuthChecker } from '../Modules/Auth/AuthChecker'
import { AuthResolvers } from '../Modules/Auth/AuthResolvers'
import { QuestResolvers } from '../Repository/Quest/Quest.Resolvers'
import { ContactResolvers } from '../Repository/Contact/Contact.Resolvers'
import path from 'path'

export const buildSchema = async (): Promise<GraphQLSchema> => {
  return await tsBuildSchema({
    resolvers: [AuthResolvers, AccountResolvers, QuestResolvers, ContactResolvers],
    validate: false,
    authChecker: appAuthChecker,
    emitSchemaFile: path.resolve(__dirname, '../../schema.gql'),
  })
}
