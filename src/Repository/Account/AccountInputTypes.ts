import { Field, InputType } from 'type-graphql'

@InputType()
export class UpdateAccountInputType {
  @Field({ nullable: true })
  alias?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  bio?: string

  @Field({ nullable: true })
  cover?: string

  @Field({ nullable: true })
  avatar?: string

  @Field({ nullable: true })
  autoBurn?: boolean
}
