import { Field, ObjectType } from 'type-graphql'
import { getModelForClass, prop } from '@typegoose/typegoose'

@ObjectType()
export class Contact {
  @Field({ nullable: true })
  @prop({
    required: true,
    unique: true,
  })
  address!: string
}

export const ContactModel = getModelForClass(Contact, {
  schemaOptions: {
    timestamps: true,
    collection: 'contacts',
  },
})
