import { AccountModel } from '../../Repository/Account/Account.Entity'
import ethUtil from 'ethereumjs-util'
import sigUtil from 'eth-sig-util'
import { areKeysEqual } from '../index'

export const validateSignature = async (
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

  const { nonce } = account

  try {
    const message = ethUtil.bufferToHex(Buffer.from(`Approve Signature on ZkPad with nonce ${nonce}`, 'utf8'))

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
