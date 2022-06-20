import { Field, InputType } from 'type-graphql'

@InputType()
export class UpdateAccountInputType {
  @Field({ nullable: true })
  alias?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  bio?: string

  @Field()
  signature!: string

  @Field()
  signatureAddress!: string
}
