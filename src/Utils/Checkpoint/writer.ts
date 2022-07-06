import { ethers } from 'ethers'
import { AccountModel } from '../../Repository/Account/Account.Entity'
import { validateAndParseAddress } from 'starknet/utils/address'
import { ProjectModel } from '../../Repository/Project/Project.Entity'
import { TransactionModel } from '../../Repository/Transaction/Transaction.Entity'

export async function handleTransferSingle({ receipt, tx, block }): Promise<void> {
  try {
    // console.log('Handle Lottery Ticket Mint', receipt.events)
    const idoId = BigInt(receipt.events[0].data[3]).toString() // Uint256
    const amount = BigInt(receipt.events[0].data[5]).toString() // Uint256
    const from = validateAndParseAddress(receipt.events[0].data[1])
    const to = validateAndParseAddress(receipt.events[0].data[2])
    // const toAddress = validateAndParseAddress(receipt.events[0].data[1])

    if (Number(from) === 0) {
      // Tickets being claimed
      const _project = await ProjectModel.findOne({ idoId }).exec()
      await ProjectModel.updateOne({ idoId }, { totalClaimedTickets: _project.totalClaimedTickets + Number(amount) })
      const _tx = {
        hash: tx.transaction_hash,
        timestamp: block.timestamp,
        contractAddress: tx.contract_address,
        name: 'Claim Tickets',
        callerAddress: from,
      }
      await AccountModel.updateOne({ address: to }, { hasClaimedTickets: true, $push: { transactions: _tx } })
      // Add Transaction to History
      await TransactionModel.create(_tx)
    } else if (Number(to) === 0) {
      // Tickets being burned
      // const _project = await ProjectModel.findOne({ idoId }).exec()
      // const _account = await AccountModel.findOne({ address: from }).exec()
      const _tx = {
        hash: tx.transaction_hash,
        timestamp: block.timestamp,
        contractAddress: tx.contract_address,
        name: 'Burn Tickets',
        callerAddress: to,
      }
      // Add Transaction to History
      const newTx = await TransactionModel.create(_tx)
      await AccountModel.updateOne({ address: from }, { $push: { transactions: newTx } })
    }
  } catch (error) {
    console.error(error)
  }
}

export async function handleVaultDeposit({ receipt, tx, block }): Promise<void> {
  // console.log('Handle Vault Deposit', receipt.events)
  try {
    const caller = validateAndParseAddress(receipt.events[3].data[0])
    const receiver = validateAndParseAddress(receipt.events[3].data[1])
    const assets = BigInt(receipt.events[3].data[2]).toString()
    const shares = BigInt(receipt.events[3].data[4]).toString()
    console.log(receiver, ethers.utils.formatUnits(assets, 'ether'), ethers.utils.formatUnits(shares, 'ether'))
    const _tx = {
      hash: tx.transaction_hash,
      timestamp: block.timestamp,
      name: 'Deposit',
      contractAddress: tx.contract_address,
      callerAddress: caller,
    }

    // Add Transaction to History
    const newTx = await TransactionModel.create(_tx)
    await AccountModel.updateOne({ address: receiver }, { $push: { transactions: newTx } }).exec()
  } catch (error) {
    console.error(error)
  }
}

export async function handleVaultWithdraw({ receipt, tx, block }): Promise<void> {
  // console.log('Handle Vault Deposit', receipt.events)
  try {
    const caller = validateAndParseAddress(receipt.events[3].data[0])
    const receiver = validateAndParseAddress(receipt.events[3].data[2])
    const assets = BigInt(receipt.events[3].data[3]).toString()
    const shares = BigInt(receipt.events[3].data[5]).toString()
    console.log(receiver, ethers.utils.formatUnits(assets, 'ether'), ethers.utils.formatUnits(shares, 'ether'))

    const _tx = {
      hash: tx.transaction_hash,
      timestamp: block.timestamp,
      name: 'Withdraw',
      contractAddress: tx.contract_address,
      callerAddress: caller,
    }

    // Add Transaction to History
    const newTx = await TransactionModel.create(_tx)
    await AccountModel.updateOne({ address: receiver }, { $push: { transactions: newTx } })
  } catch (error) {
    console.error(error)
  }
}

export async function handleDeploy(): Promise<void> {
  console.log('Handle deploy')
}
