import { getModelForClass, prop } from '@typegoose/typegoose'
import { Field, ID, ObjectType } from 'type-graphql'
import { ObjectId } from '../../Utils/Types'

@ObjectType()
export class ABI {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field({ nullable: true })
  @prop()
  address!: string

  @Field({ nullable: true })
  @prop()
  abi!: string
}

export const ABIModel = getModelForClass(ABI, {
  schemaOptions: {
    timestamps: true,
    collection: 'abis',
  },
})
