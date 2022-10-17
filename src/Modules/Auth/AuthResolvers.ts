import { Arg, Authorized, Ctx, Mutation, Query } from 'type-graphql'
import jwt from 'jsonwebtoken'
import {
  createAccountByAddress,
  existsAccountByEmail,
  getAccountByEmailAndPassword,
} from '../../Repository/Account/AccountService'
import { globals } from '../../Utils/Globals'
import { getParsedAddress } from '../../Utils/Starknet'
import { UserAccess } from './AuthChecker'
import isEmail from 'validator/lib/isEmail'
import { Account, AccountModel } from '../../Repository/Account/Account.Entity'
import { hashSync } from 'bcrypt'

import nanoid from 'nanoid'
import { AppContext } from 'Utils/Types/context'

export class AuthResolvers {
  @Query(() => String, { nullable: true })
  async getToken(@Arg('address') address: string): Promise<string> {
    const parsedAddress = getParsedAddress(address)

    if (!parsedAddress) {
      throw new Error('invalid address')
    }
    // Keeping your error catch if you need it 🤓
    let acc: Awaited<ReturnType<typeof createAccountByAddress>>

    try {
      acc = await createAccountByAddress(parsedAddress)
    } catch (err) {
      console.error('could not create or get account with address', {
        address,
        parsedAddress,
        err,
      })
      throw new Error('Invalid address')
    }

    return acc
      ? jwt.sign(
          {
            id: acc.id,
            data: parsedAddress,
          },
          globals.JWT_KEY,
          { expiresIn: '24h' }
        )
      : null
  }

  @Mutation(() => String)
  async signup(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('address', { nullable: true }) address?: string
  ) {
    if (await existsAccountByEmail(email)) throw new Error('User already exists')

    if (!isEmail(email)) throw new Error('Invalid email')

    if (address && !(await AccountModel.exists({ address }))) throw new Error('Invalid address')

    const acc = !address
      ? await AccountModel.create({ email, password: hashSync(password, 10) })
      : await AccountModel.findOneAndUpdate({ address }, { email, password: hashSync(password, 10) }, { new: true })

    return jwt.sign({ data: acc.address ?? null, id: acc.id }, globals.JWT_KEY, { expiresIn: '24h' })
  }

  @Mutation(() => String)
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    const acc = await getAccountByEmailAndPassword(email, password)

    const parsedAddress = acc?.address && getParsedAddress(acc.address)

    if (!acc) throw new Error('Wrong password')

    return jwt.sign({ data: parsedAddress ?? null, id: acc.id }, globals.JWT_KEY, { expiresIn: '24h' })
  }

  /**
   * Throws an error if user is not an admin
   */
  @Authorized([UserAccess.Admin])
  @Query(() => Boolean)
  isAdmin(): boolean {
    return true
  }

  @Mutation(() => Boolean)
  async validateResetToken(@Arg('token') token: string) {
    return !!(await this.isTokenValid(token))
  }

  @Mutation(() => Boolean)
  async resetPassword(@Arg('token') token: string, @Arg('newPassword') newPassword: string) {
    const acc = await this.isTokenValid(token)

    if (!acc) throw new Error('Invalid token')

    return !!(await acc.update({ password: hashSync(newPassword, 10) }))
  }

  @Mutation(() => Date)
  async requestPasswordReset(@Arg('email') email: string, @Ctx() { mailer, device }: AppContext) {
    const acc = await AccountModel.exists({ email })
    // it's more secure to not to throw an error if account doesn't exists

    const resetTokenValidUntil = new Date(Date.now() + 36e5)

    const token = nanoid()

    if (acc) {
      AccountModel.findOneAndUpdate(
        acc,
        {
          resetTokenValidUntil,
          resetToken: token,
        },
        { new: true }
      )
        .exec()
        .then((acc) => {
          mailer.sendPasswordReset({ to: acc.email, template: { token, timestamp: new Date(), device } })
        })
    }

    return resetTokenValidUntil
  }

  private async isTokenValid(token: string) {
    const acc = await AccountModel.findOne({ resetToken: token })
    if (!acc || acc.resetTokenValidUntil.getTime() < Date.now()) {
      throw new Error('Invalid token')
    } else return acc
  }
}
