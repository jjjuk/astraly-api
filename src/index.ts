import 'dotenv/config'

import 'reflect-metadata'
import Koa from 'koa'
import KoaRouter from '@koa/router'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import { ApolloServer } from 'apollo-server-koa'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { buildSchema } from './Utils/schema'
import Logger from './Utils/Logger'
import { globals } from './Utils/Globals'
import { initCheckpoint } from './Utils/Checkpoint'
import { connectToDb } from './Utils/Db'
import { initGlobals } from './Utils/Globals/init'
import { generateQuestsData } from './Utils/Seed/generateQuestsData'
import { generateProjects } from './Utils/Seed/generateProjects'
import { AccountModel, SocialLinkType } from './Repository/Account/Account.Entity'
import { validateAndParseAddress } from 'starknet'

void initGlobals()

const app = new Koa()
app.use(cors())
app.use(
  bodyParser({
    formLimit: '500mb',
    jsonLimit: '500mb',
  })
)

const argv = process.argv.slice(2) || []
const command = argv[0]

const startServer = async (): Promise<void> => {
  await connectToDb(globals.DB_HOST, globals.DB_NAME)

  const schema = await buildSchema()
  const server = new ApolloServer({
    schema,
    context: async ({ ctx }) => {
      let jwtToken = ctx?.request.headers.authorization || ''

      let address = ''

      if (jwtToken) {
        try {
          jwtToken = jwtToken.replace('Bearer ', '')
          const { data } = jwt.verify(jwtToken, globals.JWT_KEY) as JwtPayload
          address = data
        } catch (e) {
          console.error('CTX, INVALID JWT')
        }
      }

      return {
        jwtToken,
        address,
      }
    },
  })

  app.listen({ port: globals.PORT }, () => {
    Logger.info(`🚀 Server ready at https://${globals.HOST}:${globals.PORT}${server.graphqlPath}, ${globals.API_URL}`)
  })

  await server.start()

  server.applyMiddleware({ app, path: `/api${server.graphqlPath}` })

  const apiRouter = new KoaRouter()

  apiRouter.get('/api', (ctx) => {
    ctx.body = 'hello captain'
  })

  apiRouter.get('/api/twitter-callback', async (ctx) => {
    const { code, state } = ctx.request.query
    const { token } = await globals.authClient.requestAccessToken(code as string)

    const _address = Array.isArray(state) ? state[0] : state

    const account = await AccountModel.findOne({
      address: validateAndParseAddress(_address),
    }).exec()

    account.socialLinks = account.socialLinks.map((x) => {
      if (x.type !== SocialLinkType.TWITTER) {
        return x
      }

      return {
        ...x,
        token,
      }
    })

    await account.save()

    ctx.status = 303
    ctx.redirect(`${globals.APP_URL}/profile`)
  })

  app.use(apiRouter.routes()).use(apiRouter.allowedMethods())

  await initCheckpoint()
}

if (command === 'generateQuests') {
  void connectToDb(globals.DB_HOST, globals.DB_NAME).then(async () => await generateQuestsData())
} else if (command === 'generateProjects') {
  void connectToDb(globals.DB_HOST, globals.DB_NAME).then(async () => await generateProjects())
} else {
  void startServer()
}
