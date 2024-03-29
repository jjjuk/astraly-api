import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Account, AccountModel, SocialLinkType } from './Account.Entity'
import { Context } from 'koa'
import { UpdateAccountInputType } from './AccountInputTypes'
import { AppFileModel } from '../File/File.Entity'
import { globals } from '../../Utils/Globals'
import { DocumentType } from '@typegoose/typegoose'
import { getParsedAddress } from '../../Utils/Starknet'
import { connectWalletToAccount } from './AccountService'
import { add } from 'date-fns'

@Resolver()
export class AccountResolvers {
  @Query(() => String)
  hello(): string {
    return 'world'
  }

  @Authorized()
  @Mutation(() => Account)
  async updateAccount(@Arg('data') data: UpdateAccountInputType, @Ctx() { id }: Context): Promise<Account> {
    const { ...savableData } = data
    const account = await AccountModel.findOne({
      id,
    }).exec()

    const saveFile = async (field: 'cover' | 'avatar'): Promise<void> => {
      if (savableData[field]) {
        const file = await AppFileModel.findById(savableData[field]).exec()

        if (!file) {
          throw new Error(`file not found for ${field}`)
        }

        file.isUsed = true
        await file.save()
      }

      if (account[field]) {
        AppFileModel.findByIdAndUpdate(account[field], {
          $set: {
            isUsed: false,
          },
        })
          .exec()
          .catch(console.error)
      }
    }

    savableData.cover !== undefined && (await saveFile('cover'))
    savableData.avatar !== undefined && (await saveFile('avatar'))

    return await AccountModel.findOneAndUpdate(
      {
        id,
      },
      {
        ...savableData,
      },
      {
        new: true,
      }
    ).exec()
  }

  @Authorized()
  @Query(() => Account)
  me(@Ctx() { address, id }: Context): Promise<Account> {
    return AccountModel.findOne(id ? { id } : { address })
      .populate('transactions')
      .exec()
  }

  @Query(() => Number)
  total(): Promise<number> {
    return AccountModel.countDocuments().exec()
  }

  @Query(() => Account, { nullable: true })
  getAccount(@Arg('address') address: string): Promise<Partial<Account>> {
    return AccountModel.findOne({ address: getParsedAddress(address) }).exec()
  }

  @Authorized()
  @Mutation(() => Account)
  async linkSocial(
    @Arg('type') type: SocialLinkType,
    @Arg('id', { nullable: true }) id: string,
    @Ctx() { address, id: _id }: Context
  ): Promise<DocumentType<Account>> {
    const account = await AccountModel.findOne(_id ? { id: _id } : { address }).exec()

    if (account.socialLinks.find((x) => x.type === type)) {
      if (!id) {
        account.socialLinks = account.socialLinks.filter((x) => x.type !== type)
      } else {
        account.socialLinks = account.socialLinks.map((x) => {
          if (x.type !== type) {
            return x
          }

          return {
            ...x,
            id,
          }
        })
      }

      await account.save()

      return account
    }

    return await AccountModel.findByIdAndUpdate(
      account,
      {
        $push: { socialLinks: { type, id } },
      },
      { new: true }
    ).exec()
  }

  @Authorized()
  @Query(() => String)
  getTwitterAuthUrl(@Ctx() { id }: Context): string {
    return globals.authClient.generateAuthURL({
      state: id,
      code_challenge_method: 's256',
    })
  }

  @Authorized()
  @Mutation(() => Account)
  linkWallet(@Ctx() { id }: Context, @Arg('address') address: string) {
    return connectWalletToAccount(id, getParsedAddress(address))
  }
}
