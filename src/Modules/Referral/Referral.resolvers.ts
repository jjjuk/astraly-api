import { Arg, Authorized, Ctx, Query } from 'type-graphql'
import { ApolloError } from 'apollo-server-koa'
import { enc, AES } from 'crypto-js'

import { AccountModel } from '../../Repository/Account/Account.Entity'
import { globals } from '../../Utils/Globals'
import { ApolloErrors } from '../../Utils/Types'
import { AppContext } from 'Utils/Types/context'

export class ReferralResolvers {
  @Authorized()
  @Query(() => String, { nullable: true })
  async getReferralAddress(
    @Arg('idoId') idoId: string,
    @Arg('referralCode') referralCode: string,
    @Ctx() { id }: AppContext
  ) {
    let decoded = ''

    try {
      decoded = AES.decrypt(referralCode, globals.REFERRAL_SECRET).toString(enc.Utf8)
    } catch {
      return null
    }

    const splitted = decoded.split(':')
    if (splitted.length !== 2) return null

    const [_idoId, broughtBy] = splitted as [string, string]
    if (_idoId !== idoId) return null

    if (id === broughtBy)
      throw new ApolloError("You can't use your own referral link!", ApolloErrors.FORBIDDEN, { field: 'idoId' })

    const acc = await AccountModel.findById(broughtBy, { address: 1 })
    if (!acc?.address) return null

    return acc.address
  }
}
