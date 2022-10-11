import { Arg, Authorized, Mutation, Query } from 'type-graphql'
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

export class AuthResolvers {
  @Query(() => String)
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

    return jwt.sign(
      {
        id: acc.id,
        data: parsedAddress,
      },
      globals.JWT_KEY,
      { expiresIn: '24h' }
    )
  }

  @Mutation(() => String)
  async signup(@Arg('email') email: string, @Arg('password') password: string) {
    if (await existsAccountByEmail(email)) throw new Error('User already exists')

    if (!isEmail(email)) throw new Error('Invalid email')

    const acc = await AccountModel.create({ email, password: hashSync(password, 10) })

    return jwt.sign({ data: null, id: acc.id }, globals.JWT_KEY, { expiresIn: '24h' })
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
}
