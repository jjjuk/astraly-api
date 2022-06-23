import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Quest, QuestModel } from './Quest.Entity'
import { AppContext } from '../../Utils/Types/context'
import { AccountModel } from '../Account/Account.Entity'
import { QuestHistoryModel } from './QuestHistory.Entity'
import { MerkleProofsModel } from './MerkleProofs.Entity'

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

  @Authorized()
  @Query(() => [String])
  async getMerkleProof(@Arg('idoId') idoId: string, @Ctx() { address }: AppContext): Promise<string> {
    const account = await AccountModel.findOne({
      address,
    }).exec()

    if (!account) {
      throw new Error('account not found')
    }

    const merkleProofs = await MerkleProofsModel.findOne({
      idoId: Number(idoId),
    }).exec()
    const proof = merkleProofs.data[address]

    if (!proof) {
      throw new Error('no proof found for address')
    }

    return proof
  }
}
