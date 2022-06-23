/* eslint-disable @typescript-eslint/naming-convention */
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Quest, QuestModel } from './Quest.Entity'
import { AppContext } from '../../Utils/Types/context'
import { AccountModel } from '../Account/Account.Entity'
import { QuestHistoryModel } from './QuestHistory.Entity'
// import { MerkleProofsModel } from './MerkleProofs.Entity'
// import { hash } from 'starknet'

/**
 * Generate Merkle Tree leaf from address and value
 * @param {string} address of airdrop claimee
 * @param {string} value of airdrop tokens to claimee
 * @returns {Buffer} Merkle Tree node
 */
// function generateLeaf(address: string, value: string): Buffer {
//   return Buffer.from(
//     // Hash in appropriate Merkle format
//     hash.pedersen([address, value]).slice(2),
//     'hex'
//   )
// }

// const merkleTree = new MerkleTree(
//   tree.tree.leaves.map((l) => Buffer.from(l.data)),
//   hash.computeHashOnElements,
//   { sortPairs: true }
// )

@Resolver()
export class QuestResolvers {
  @Authorized()
  @Mutation(() => Quest, { nullable: true })
  async completeQuest(@Arg('questId') questId: string, @Ctx() { address }: AppContext): Promise<Quest> {
    const account = await AccountModel.findOne({
      address,
    }).exec()

    if (!account) {
      throw new Error('account not found')
    }

    const quest = await QuestModel.findById(questId).exec()

    if (!quest) {
      throw new Error('quest not found')
    }

    await AccountModel.findByIdAndUpdate(account, {
      $push: { questCompleted: quest },
    }).exec()

    await QuestHistoryModel.create({
      quest,
      idoId: quest.idoId,
      address,
      completionDate: new Date(),
    })

    return quest
  }

  // @Authorized()
  // @Query(() => [String])
  // async getMerkleProof(@Arg('idoId') idoId: string, @Ctx() { address }: AppContext): Promise<string[]> {
  //   const account = await AccountModel.findOne({
  //     address,
  //   }).exec()

  //   if (!account) {
  //     throw new Error('account not found')
  //   }
  //   console.log(idoId)
  //   const value = airdrop[address]
  //   const leaf = generateLeaf(address, value)
  //   const proof = merkleTree.getHexProof(leaf)

  //   if (!proof) {
  //     throw new Error('no proof found for address')
  //   }

  //   return proof
  // }
}
