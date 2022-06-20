import { Field, ID, ObjectType } from 'type-graphql'
import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { Quest } from './Quest.Entity'
import { ObjectId } from '../../Utils/Types'

@ObjectType()
export class QuestHistory {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field({ nullable: true })
  @prop()
  idoId!: number

  @Field(() => Quest, { nullable: true })
  @prop({ ref: 'Quest' })
  quest!: Ref<Quest>

  @Field({ nullable: true })
  @prop()
  address!: string

  @Field({ nullable: true })
  @prop()
  completionDate!: Date
}

export const QuestHistoryModel = getModelForClass(QuestHistory, {
  schemaOptions: {
    timestamps: true,
    collection: 'questsHistory',
  },
})
