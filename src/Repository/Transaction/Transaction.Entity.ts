import { getModelForClass, prop } from '@typegoose/typegoose'
import { Field, ID, ObjectType } from 'type-graphql'
import { ObjectId } from '../../Utils/Types'

@ObjectType()
export class Transaction {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field({ nullable: true })
  @prop()
  contractAddress!: string

  @Field({ nullable: true })
  @prop()
  callerAddress!: string

  @Field({ nullable: true })
  @prop()
  hash!: string

  @Field({ nullable: true })
  @prop()
  name!: string

  @Field({ nullable: true })
  @prop()
  timestamp!: Date
}

export const TransactionModel = getModelForClass(Transaction, {
  schemaOptions: {
    timestamps: true,
    collection: 'transactions',
  },
})
