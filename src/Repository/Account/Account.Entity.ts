import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { Field, ID, ObjectType } from 'type-graphql'
import { ObjectId } from '../../Utils/Types'
import { Quest } from '../Quest/Quest.Entity'
import { Transaction } from '../Transaction/Transaction.Entity'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { AppFile } from '../File/File.Entity'

@ObjectType()
export class Account {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field({ nullable: true })
  @prop({
    required: true,
    unique: true,
  })
  address!: string

  @Field({ nullable: true })
  @prop()
  alias?: string

  @Field({ nullable: true })
  @prop()
  email?: string

  @Field({ nullable: true })
  @prop()
  bio?: string

  @Field({ nullable: true })
  @prop()
  bannerHash?: string

  @Field({ nullable: true })
  @prop({
    default: false,
  })
  hasClaimedTickets?: boolean

  @Field(() => [Quest], { nullable: true })
  @prop({ ref: 'Quest' })
  questCompleted?: Array<Ref<Quest>>

  @Field(() => [Transaction], { nullable: true })
  @prop({ ref: 'Transaction' })
  transactions?: Array<Ref<Transaction>>

  @prop({ ref: 'AppFile' })
  cover: Ref<AppFile>

  @Field({ nullable: true })
  @prop()
  avatar: string
}

export const AccountModel: ModelType<Account> = getModelForClass(Account, {
  schemaOptions: {
    timestamps: true,
    collection: 'accounts',
  },
})
