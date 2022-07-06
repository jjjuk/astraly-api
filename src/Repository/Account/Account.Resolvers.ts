import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Account, AccountModel } from './Account.Entity'
import { Context } from 'koa'
import { UpdateAccountInputType } from './AccountInputTypes'
// import { validateSignature } from '../../Utils/Starknet/validateSignature'
import { AppFileModel } from '../File/File.Entity'

@Resolver()
export class AccountResolvers {
  @Query(() => String)
  hello(): string {
    return 'world'
  }

  @Authorized()
  @Mutation(() => Account)
  async updateAccount(@Arg('data') data: UpdateAccountInputType, @Ctx() { address }: Context): Promise<Account> {
    const { alias: _a, ...savableData } = data
    const account = await AccountModel.findOne({
      address,
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
        address,
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
  async me(@Ctx() { address }: Context): Promise<Account> {
    return await AccountModel.findOne({
      address,
    })
      .populate('transactions')
      .exec()
  }

  @Query(() => Account)
  async getAccount(@Arg('address') address: string): Promise<Partial<Account>> {
    const account = await AccountModel.findOne({
      address,
    }).exec()

    if (!account) {
      return null
    }

    return {
      address,
      bio: account.bio,
      alias: account.alias,
      questCompleted: account.questCompleted,
    }
  }
}
