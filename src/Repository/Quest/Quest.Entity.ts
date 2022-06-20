import { Field, ID, ObjectType } from 'type-graphql'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { ObjectId } from '../../Utils/Types'

@ObjectType()
export class Quest {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field({ nullable: true })
  @prop()
  idoId!: number
}

export const QuestModel = getModelForClass(Quest, {
  schemaOptions: {
    timestamps: true,
    collection: 'quests',
  },
})
