import { createUnionType, Field, ID, ObjectType, registerEnumType } from 'type-graphql'
import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { ObjectId } from '../../Utils/Types'

@ObjectType()
export class Felt {
  @Field({ nullable: true })
  @prop()
  value: string
}

@ObjectType()
export class Uint256 {
  @Field({ nullable: true })
  @prop()
  low: number

  @Field({ nullable: true })
  @prop()
  high: number
}

const CallDataValue = createUnionType({
  name: 'CallDataValue',
  types: () => [Felt, Uint256] as const,
  resolveType: value => {
    if ('value' in value) {
      return Felt
    }
    if ('low' in value) {
      return Uint256
    }
    return undefined
  },
})

@ObjectType()
@modelOptions({ options: {allowMixed: Severity.ALLOW } })
export class CallData {
  @Field({ nullable: true })
  @prop()
  name: string

  @Field({ nullable: true })
  @prop()
  type: string

  @Field(() => CallDataValue, { nullable: true })
  @prop()
  value: Uint256 | Felt
}

@ObjectType()
export class OrganizedEvent {
  @Field({ nullable: true })
  @prop()
  name: string

  @Field({ nullable: true })
  @prop()
  transmitterContract: string

  @Field(() => [CallData], { nullable: true })
  @prop({ type: () => [CallData], _id: false })
  callData: CallData[]
}

export enum QuestType {
  SOCIAL = 'SOCIAL',
  PRODUCT = 'PRODUCT',
}

registerEnumType(QuestType, {
  name: 'QuestType',
})

@ObjectType()
export class Quest {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field({ nullable: true })
  @prop( { index: true })
  idoId!: number

  @Field({ nullable: true })
  @prop()
  name: string

  @Field({ nullable: true })
  @prop()
  description: string

  @Field(() => OrganizedEvent, { nullable: true })
  @prop({ type: OrganizedEvent })
  event: OrganizedEvent

  @Field({ nullable: true })
  @prop()
  icon: string

  @Field({ nullable: true })
  @prop()
  link: string

  @Field({ nullable: true })
  @prop()
  isClaimed: boolean

  @Field(() => QuestType, { nullable: true })
  @prop({ enum: QuestType, type: String })
  type: QuestType
}

export const QuestModel = getModelForClass(Quest, {
  schemaOptions: {
    timestamps: true,
    collection: 'quests',
  },
})
