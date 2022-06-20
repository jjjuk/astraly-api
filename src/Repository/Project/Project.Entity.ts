import { Field, ID } from 'type-graphql'
import { ObjectId } from '../../Utils/Types'
import { getModelForClass, prop } from '@typegoose/typegoose'

export class Project {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field({ nullable: true })
  @prop()
  idoId!: string

  @Field({ nullable: true })
  @prop()
  tokenAddress!: string

  @Field({ nullable: true })
  @prop({ default: 0 })
  voteCount!: number

  // @Field({ nullable: true })
  // @prop()
  // saleOwnerAddress!: string
  //
  // @Field({ nullable: true })
  // @prop()
  // tokenPrice!: number
  //
  // @Field({ nullable: true })
  // @prop()
  // amountOfTokensToSell!: number
  //
  // @Field({ nullable: true })
  // @prop()
  // saleEndTime!: Date
  //
  // @Field({ nullable: true })
  // @prop()
  // tokensUnlockTime!: Date
  //
  // @Field({ nullable: true })
  // @prop()
  // totalTokensSold!: number
  //
  // @Field({ nullable: true })
  // @prop()
  // totalWinningTickets!: number
  //
  // @Field({ nullable: true })
  // @prop()
  // totalRaised!: number
  //
  // @Field({ nullable: true })
  // @prop()
  // portionsVestingPrecision!: number
  //
  // @Field({ nullable: true })
  // @prop()
  // lotteryTicketsBurnCap!: number
  //
  // @Field({ nullable: true })
  // @prop()
  // numberOfParticipants!: number

  @Field({ nullable: true })
  @prop()
  created!: Date

  @Field({ nullable: true })
  @prop()
  tx!: string
}

export const ProjectModel = getModelForClass(Project, {
  schemaOptions: {
    timestamps: true,
    collection: 'projects',
  },
})
