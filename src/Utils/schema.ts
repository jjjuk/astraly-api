import { buildSchema as tsBuildSchema } from 'type-graphql'
import { GraphQLSchema } from 'graphql'
import { AccountResolvers } from '../Repository/Account/Account.Resolvers'
import { appAuthChecker } from '../Modules/Auth/AuthChecker'
import { AuthResolvers } from '../Modules/Auth/AuthResolvers'
import { QuestResolvers } from '../Repository/Quest/Quest.Resolvers'
import { ContactResolvers } from '../Repository/Contact/Contact.Resolvers'
import path from 'path'
import { ProjectResolvers } from '../Repository/Project/Project.Resolvers'
import { FileResolvers } from '../Modules/Files/File.Resolvers'
import { GraphQLJSON } from 'graphql-type-json'
import { AccountFieldResolvers } from '../Repository/Account/Account.FieldResolvers'
import { ProjectFieldResolvers } from '../Repository/Project/Project.FieldResolvers'
import { FormsResolvers } from '../Modules/Forms/Forms.Resolvers'
import { ReferralResolvers } from '../Modules/Referral/Referral.resolvers'

export const buildSchema = async (): Promise<GraphQLSchema> => {
  return await tsBuildSchema({
    resolvers: [
      AuthResolvers,
      AccountResolvers,
      QuestResolvers,
      ContactResolvers,
      ProjectResolvers,
      FileResolvers,
      AccountFieldResolvers,
      ProjectFieldResolvers,
      FormsResolvers,
      ReferralResolvers,
    ],
    validate: false,
    authChecker: appAuthChecker,
    scalarsMap: [
      // @ts-expect-error
      { type: GraphQLJSON, scalar: GraphQLJSON },
    ],
    emitSchemaFile: path.resolve(__dirname, '../../schema.gql'),
  })
}
