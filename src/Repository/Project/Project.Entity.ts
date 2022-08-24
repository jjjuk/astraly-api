import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'
import { ObjectId } from '../../Utils/Types'
import { getModelForClass, prop } from '@typegoose/typegoose'

@ObjectType()
export class Round {
  @Field({ nullable: true })
  @prop()
  title: string

  @Field({ nullable: true })
  @prop()
  description: string

  @Field({ nullable: true })
  @prop()
  startDate: Date

  @Field({ nullable: true })
  @prop()
  endDate: Date
}

@ObjectType()
export class ProjectDescriptionItem {
  @Field({ nullable: true })
  @prop()
  key: string

  @Field({ nullable: true })
  @prop()
  value: string
}

export enum ProjectType {
  IDO = 'IDO',
  INO = 'INO',
  LBP = 'LBP',
  GDA = 'GDA',
}

registerEnumType(ProjectType, {
  name: 'ProjectType',
})

@ObjectType()
export class Project {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field({ nullable: true })
  @prop()
  idoId!: string

  @Field({ nullable: true })
  @prop()
  tokenAddress!: string

  // @Field({ nullable: true })
  // @prop({ default: 0 })
  // voteCount!: number

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
  @Field({ nullable: true })
  @prop()
  totalClaimedTickets!: number
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
  name: string

  @Field({ nullable: true })
  @prop()
  description: string

  @Field(() => ProjectType, { nullable: true })
  @prop({ enum: ProjectType, type: String })
  type?: ProjectType

  @Field({ nullable: true })
  @prop()
  tx!: string

  @Field({ nullable: true })
  @prop()
  ticker?: string

  @Field({ nullable: true })
  @prop()
  logo?: string

  @Field({ nullable: true })
  @prop()
  cover?: string

  @Field({ nullable: true })
  @prop()
  coverVideo?: string

  @Field({ nullable: true })
  @prop()
  totalRaise?: number

  @Field({ nullable: true })
  @prop()
  tokenPrice?: number

  // @Field({ nullable: true })
  // @prop()
  // maxAllocation?: number

  @Field({ nullable: true })
  @prop({})
  currentRoundIndex: number

  @Field(() => [String], { nullable: true })
  @prop({ type: () => [String] })
  categories?: string[]

  @Field(() => [Round], { nullable: true })
  @prop({ type: () => [Round] })
  rounds: Round[]

  @Field({ nullable: true })
  @prop({ default: false })
  isFinished: boolean

  @Field(() => [ProjectDescriptionItem], { nullable: true })
  @prop({ type: () => [ProjectDescriptionItem], id: false })
  projectDescription: ProjectDescriptionItem[]

  @Field(() => [ProjectDescriptionItem], { nullable: true })
  @prop({ type: () => [ProjectDescriptionItem], id: false })
  links: ProjectDescriptionItem[]
}

export const ProjectModel = getModelForClass(Project, {
  schemaOptions: {
    timestamps: true,
    collection: 'projects',
  },
})
