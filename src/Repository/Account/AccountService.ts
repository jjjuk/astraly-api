import { Account, AccountModel } from './Account.Entity'

export const createAccountByAddress = async (address: string): Promise<Account> => {
  const account = await AccountModel.findOne({
    address,
  }).exec()

  return (
    account ??
    (await AccountModel.create({
      address,
    }))
  )
}
