import { compareSync } from 'bcrypt'
import { AccountModel } from './Account.Entity'

export const createAccountByAddress = async (address: string) => {
  const account = await AccountModel.findOne({ address }).exec()
  return account ?? (await AccountModel.create({ address }))
}

export const existsAccountByEmail = async (email: string): Promise<boolean> => {
  return !!(await AccountModel.exists({ email }).exec())
}

export const getAccountByEmailAndPassword = async (email: string, password: string) => {
  const acc = await AccountModel.findOne({ email }).exec()

  return acc && compareSync(password, acc.password) ? acc : null
}
