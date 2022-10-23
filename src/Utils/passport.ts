import jwt from 'jsonwebtoken'
import { Middleware } from 'koa'
import { Profile as GoogleProfile, VerifyCallback, Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Profile as TwitterProfile, Strategy as TwitterStrategy } from 'passport-twitter'

import { AccountModel } from '../Repository/Account/Account.Entity'

import { globals } from './Globals'
import { initGlobals } from './Globals/init'

void initGlobals()

const getProfile = (_: string, __: string, profile: GoogleProfile & TwitterProfile, done: VerifyCallback): void => {
  if (!profile.emails[0].value) done(new Error("Can't get account email"))

  AccountModel.findOneAndUpdate({ email: profile.emails[0].value }, {}, { upsert: true, new: true })
    .exec()
    .then((user) => done(null, user.toObject()))
    .catch(done)
}

export const twitterStrategy = new TwitterStrategy(
  {
    consumerKey: globals.TW_CLIENT_ID,
    consumerSecret: globals.TW_CLIENT_SECRET,
    callbackURL: `${globals.API_URL}/auth/twitter/callback`,
    includeEmail: true,
  },
  getProfile
)

export const googleStrategy = new GoogleStrategy(
  {
    clientID: globals.GOOGLE_CLIENT_ID,
    clientSecret: globals.GOOGLE_CLIENT_SECRET,
    callbackURL: `${globals.API_URL}/auth/google/callback`,
    scope: ['email'],
  },
  getProfile
)

export const callbackMiddleware: Middleware = (ctx) => {
  const url = new URL(`${globals.APP_URL}/set-auth-token`)

  url.searchParams.set(
    'token',
    jwt.sign({ id: ctx.state.user._id, data: ctx.state.user.address || null }, globals.JWT_KEY, {
      expiresIn: '24h',
    })
  )

  ctx.response.redirect(url.toString())
}
