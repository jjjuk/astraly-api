import { AccountModel } from '../../Repository/Account/Account.Entity'
import ethUtil from 'ethereumjs-util'
import sigUtil from 'eth-sig-util'
import { areKeysEqual } from '../index'
import { Account, defaultProvider, Signature } from 'starknet'
import { BigNumberish } from 'starknet/dist/utils/number'

export interface SignedData {
  hash: BigNumberish
  signature: Signature
}

export const validateStarknetSignature = async (publicKey: string, signedData: SignedData): Promise<boolean> => {
  const account = await AccountModel.findOne({
    address: publicKey.toLowerCase(),
  }).exec()

  if (!account) {
    return false
  }

  const _account = new Account(defaultProvider, publicKey, null)
  return await _account.verifyMessageHash(signedData.hash, signedData.signature)
}

export const validateEVMSignature = async (
  publicKey: string,
  signature: string,
  retrievedPublicKey: string
): Promise<boolean> => {
  const account = await AccountModel.findOne({
    address: publicKey.toLowerCase(),
  }).exec()

  if (!account) {
    return false
  }

  try {
    const message = ethUtil.bufferToHex(Buffer.from(`Approve Signature on Astraly`, 'utf8'))

    const address = sigUtil.recoverPersonalSignature({
      data: message,
      sig: signature,
    })

    if (areKeysEqual(address, publicKey) || areKeysEqual(address, retrievedPublicKey)) {
      await AccountModel.findByIdAndUpdate(account, {
        nonce: Math.floor(Math.random() * 9999999),
      }).exec()

      return true
    }
  } catch (e) {
    return false
  }

  return false
}
