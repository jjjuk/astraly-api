import { AccountModel } from '../../Repository/Account/Account.Entity'
import ethUtil from 'ethereumjs-util'
import sigUtil from 'eth-sig-util'
import { areKeysEqual } from '../index'
import { Contract, defaultProvider, Signature } from 'starknet'
import { BigNumberish } from 'starknet/dist/utils/number'
import { ACCOUNT_ABI } from '../constants/abi'

export interface SignedData {
  hash: BigNumberish
  signature: Signature
}

export const validateStarknetSignature = async (publicKey: string, signedData: SignedData): Promise<boolean> => {
  try {
    const _account = new Contract(ACCOUNT_ABI, publicKey, defaultProvider)
    await _account.call('is_valid_signature', [signedData.hash, signedData.signature])
    return true
  } catch (error) {
    console.error(error)
    return false
  }
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
