import 'dotenv/config'

import 'reflect-metadata'
import Koa, { Request } from 'koa'
import KoaRouter from '@koa/router'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import { ApolloServer } from 'apollo-server-koa'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { buildSchema } from './Utils/schema'
import Logger from './Utils/Logger'
import { globals } from './Utils/Globals'
// import { initCheckpoint } from './Utils/Checkpoint'
import { connectToDb } from './Utils/Db'
import { initGlobals } from './Utils/Globals/init'
import { generateQuestsData } from './Utils/Seed/generateQuestsData'
import { generateProjects } from './Utils/Seed/generateProjects'
import { AccountModel, SocialLinkType } from './Repository/Account/Account.Entity'
import Mailer from './Utils/Mail'

import woothee from 'woothee'
import passport from 'koa-passport'

import serve from 'koa-static'
import { join } from 'node:path'
import mount from 'koa-mount'
import session from 'koa-session'
import { callbackMiddleware, googleStrategy, twitterStrategy } from './Utils/passport'
// import { validateAndParseAddress } from 'starknet'

void initGlobals()

passport.use(googleStrategy)
passport.use(twitterStrategy)

const app = new Koa()
app.use(cors({ origin: '*' }))
app.use(
  bodyParser({
    formLimit: '500mb',
    jsonLimit: '500mb',
  })
)
app.keys = ['secret']
app.use(session({}, app))

app.use(passport.initialize())
app.use(passport.session())

app.use(mount('/api/static', serve(join(__dirname, '../static'))))

const argv = process.argv.slice(2) || []
const command = argv[0]

const mailer = new Mailer({ username: globals.MAILGUN_USERNAME, password: globals.MAILGUN_SMTP_PASSWORD })

const startServer = async (): Promise<void> => {
  await connectToDb(globals.DB_HOST, globals.DB_NAME)

  const schema = await buildSchema()
  const server = new ApolloServer({
    schema,
    context: async ({ ctx }) => {
      let jwtToken = ctx?.request.headers.authorization || ''

      let address = ''
      let id = ''

      if (jwtToken) {
        try {
          jwtToken = jwtToken.replace('Bearer ', '')
          const payload = jwt.verify(jwtToken, globals.JWT_KEY) as JwtPayload
          address = payload.address
          id = payload.id
        } catch (e) {
          console.error(e)
          console.error('CTX, INVALID JWT')
        }
      }

      return {
        headers: ctx?.request.headers,
        jwtToken,
        address,
        id,
        get mailer() {
          return mailer
        },
        get device() {
          if ((ctx.request as Request).header?.['user-agent']) {
            return woothee.parse(ctx.request.header['user-agent']).os
          }

          return 'Unknown Device'
        },
      }
    },
  })

  app.listen({ port: globals.PORT }, () => {
    Logger.info(`🚀 Server ready at http://${globals.HOST}:${globals.PORT}${server.graphqlPath}, ${globals.API_URL}`)
  })

  await server.start()

  server.applyMiddleware({ app, path: `/api${server.graphqlPath}` })

  const apiRouter = new KoaRouter()

  apiRouter.get('/api/auth/google', passport.authenticate('google', { session: false }))
  apiRouter.get('/api/auth/google/callback', passport.authenticate('google', { session: false }), callbackMiddleware)

  apiRouter.get('/api/auth/twitter', passport.authenticate('twitter', { session: false }))
  apiRouter.get('/api/auth/twitter/callback', passport.authenticate('twitter', { session: false }), callbackMiddleware)

  apiRouter.get('/api', (ctx) => {
    ctx.body = 'hello captain'
  })

  apiRouter.get('/api/twitter-callback', async (ctx) => {
    const { code, state } = ctx.request.query
    const { token } = await globals.authClient.requestAccessToken(code as string)

    const _address = Array.isArray(state) ? state[0] : state

    const account = await AccountModel.findOne({
      address: _address,
    }).exec()

    const user = await globals.twitterClient.users.findMyUser()

    const _username = user.data.username
    const internalId = user.data.id
    const validUntil = token.expires_at

    if (account.socialLinks.find((x) => x.type === SocialLinkType.TWITTER)) {
      account.socialLinks = account.socialLinks.map((x) => {
        if (x.type !== SocialLinkType.TWITTER) {
          return x
        }

        return {
          ...x,
          token,
          id: _username,
          internalId,
          validUntil,
        }
      })
      await account.save()
    } else {
      await AccountModel.findByIdAndUpdate(
        account,
        {
          $push: { socialLinks: { type: SocialLinkType.TWITTER, token, id: _username, internalId, validUntil } },
        },
        { new: true }
      ).exec()
    }

    ctx.status = 303
    ctx.redirect(`${globals.APP_URL}/profile`)
  })

  app.use(apiRouter.routes()).use(apiRouter.allowedMethods())

  // await initCheckpoint()
}

if (command === 'generateQuests') {
  void connectToDb(globals.DB_HOST, globals.DB_NAME).then(async () => await generateQuestsData())
} else if (command === 'generateProjects') {
  void connectToDb(globals.DB_HOST, globals.DB_NAME).then(async () => await generateProjects())
} else {
  void startServer()
}
