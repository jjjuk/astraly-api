import { getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose'
import { Field, ID, ObjectType, registerEnumType, UseMiddleware } from 'type-graphql'
import { ObjectId } from '../../Utils/Types'
import { Quest } from '../Quest/Quest.Entity'
import { Transaction } from '../Transaction/Transaction.Entity'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { AppFile } from '../File/File.Entity'
import { OnlySelfOrAdmin } from '../../Utils/GraphQl'

export enum SocialLinkType {
  DISCORD = 'DISCORD',
  TWITTER = 'TWITTER',
  TELEGRAM = 'TELEGRAM',
  FACEBOOK = 'FACEBOOK',
}

registerEnumType(SocialLinkType, {
  name: 'SocialLinkType',
})

@ObjectType()
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SocialLink {
  @Field(() => SocialLinkType, { nullable: true })
  @prop({ enum: SocialLinkType, type: String })
  type: SocialLinkType

  @UseMiddleware(OnlySelfOrAdmin)
  @Field({ nullable: true })
  @prop()
  id: string

  // should not be exposed
  @prop()
  token: any

  @prop()
  internalId: any

  @prop()
  validUntil: Date
}

@ObjectType()
export class Account {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field({ nullable: true })
  @prop({
    unique: true,
    index: true,
    sparse: true,
  })
  address?: string
  //addresses: string[]

  @Field({ nullable: true })
  @prop({ sparse: true })
  alias?: string

  @UseMiddleware(OnlySelfOrAdmin)
  @Field({ nullable: true })
  @prop({
    unique: true,
    sparse: true,
  })
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

  @Field({ nullable: true })
  @prop({
    default: false,
  })
  autoBurn?: boolean

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

  @Field(() => [SocialLink], { nullable: true })
  @prop({ type: () => [SocialLink] })
  socialLinks: SocialLink[]

  @prop({ nullable: true })
  password?: string
}

export const AccountModel: ModelType<Account> = getModelForClass(Account, {
  schemaOptions: {
    timestamps: true,
    collection: 'accounts',
  },
})
