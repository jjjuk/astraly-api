import { Arg, Authorized, Ctx, Query } from 'type-graphql'
import { enc, AES } from 'crypto-js'

import { AccountModel } from '../../Repository/Account/Account.Entity'
import { globals } from '../../Utils/Globals'
import { AppContext } from '../../Utils/Types/context'

export class ReferralResolvers {
  @Authorized()
  @Query(() => String, { nullable: true })
  async getReferralAddress(@Ctx() ctx: AppContext, @Arg('idoId') idoId: string) {
    let decoded = ''
    if (typeof ctx.headers?.['x-referral-code'] === 'string') {
      try {
        decoded = AES.decrypt(ctx.headers['x-referral-code'], globals.REFERRAL_SECRET).toString(enc.Utf8)
      } catch {
        return null
      }
    }

    const splitted = decoded.split(':')
    if (splitted.length !== 2) return null
    else console.log(splitted)

    const [_idoId, broughtBy] = splitted as [string, string]
    if (_idoId !== idoId) return null

    const acc = await AccountModel.findById(broughtBy)
    if (!acc?.address) return null

    return acc.address
  }
}
