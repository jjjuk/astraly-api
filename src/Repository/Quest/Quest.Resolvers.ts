import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Quest, QuestModel } from './Quest.Entity'
import { AppContext } from '../../Utils/Types/context'
import { AccountModel } from '../Account/Account.Entity'
import { QuestHistoryModel } from './QuestHistory.Entity'
import { MerkleProofsModel } from './MerkleProofs.Entity'
// import { UserAccess } from '../../Modules/Auth/AuthChecker'
import { validateAndParseAddress } from 'starknet'
import { DocumentType } from '@typegoose/typegoose'
import { UserAccess } from '../../Modules/Auth/AuthChecker'
import { QuestInput } from './Quest.InputTypes'

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

    if (account.questCompleted.map((x) => String(x)).includes(questId)) {
      throw new Error('quest already completed')
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
  async getMerkleProof(@Arg('idoId') idoId: string, @Ctx() { address }: AppContext): Promise<string[]> {
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

  @Query(() => Quest)
  async quest (@Arg('_id') _id: string): Promise<DocumentType<Quest>> {
    return await QuestModel.findById(_id).exec()
  }

  @Query(() => [Quest])
  async quests (@Arg('idoId', { nullable: true }) idoId?: string): Promise<Array<DocumentType<Quest>>> {
    if (idoId) {
      return await QuestModel.find({
        idoId
      }).exec()
    }

    return await QuestModel.find({}).exec()
  }

  @Authorized([UserAccess.Admin])
  @Mutation(() => Quest)
  async updateQuest (@Arg('data') data: QuestInput): Promise<DocumentType<Quest>> {
    const { _id, ...d } = data
    if (_id) {
      return await QuestModel.findByIdAndUpdate(_id, {
        $set: {
          ...d,
        }
      })
    }

    return await QuestModel.create({
      ...d
    })
  }
}
