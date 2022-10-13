import { compareSync } from 'bcrypt'
import { AccountModel } from './Account.Entity'

export const createAccountByAddress = async (address: string) => {
  if (address) {
    const account = await AccountModel.findOne({ address }).exec()
    console.log(account)
    return account ?? (await AccountModel.create({ address }))
  } else return null
}

export const connectWalletToAccount = (_id: string, address: string) => {
  return AccountModel.findOneAndUpdate({ _id }, { address }, { new: true })
}

export const existsAccountByEmail = async (email: string): Promise<boolean> => {
  return !!(await AccountModel.exists({ email }))
}

export const getAccountByEmailAndPassword = async (email: string, password: string) => {
  const acc = await AccountModel.findOne({ email }).exec()

  return acc && compareSync(password, acc.password) ? acc : null
}
