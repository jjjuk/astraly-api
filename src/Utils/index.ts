import PasswordValidator from 'password-validator'

export const areKeysEqual = (key: string, key2: string): boolean => {
  return !!key && !!key2 && key.toLowerCase() === key2.toLowerCase()
}

const passwordValidatorSchema = new PasswordValidator().min(8).max(24).uppercase().symbols()

export const validatePassword = (pwd: string) => passwordValidatorSchema.validate(pwd) as boolean
