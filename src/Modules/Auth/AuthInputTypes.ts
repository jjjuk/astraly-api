import { InputType, Field } from 'type-graphql'

@InputType()
export class SignedDataInputType {
  @Field()
  hash: string

  @Field(() => [String])
  signature: string[]
}
