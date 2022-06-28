import { Field, InputType } from 'type-graphql'
import { prop } from '@typegoose/typegoose'
import { ObjectId } from '../../Utils/Types'
import { QuestType } from './Quest.Entity'

@InputType()
export class Uint256Input {
    @Field({ nullable: true })
    low: number

    @Field({ nullable: true })
    high: number
}

@InputType()
export class CallDataInput {
    @Field({ nullable: true })
    name: string

    @Field({ nullable: true })
    type: string

    @Field(() => Uint256Input, { nullable: true })
    value: Uint256Input
}

@InputType()
export class OrganizedEventInput{
    @Field({ nullable: true })
    name: string

    @Field({ nullable: true })
    transmitterContract: string

    @Field(() => [CallDataInput], { nullable: true })
    callData: CallDataInput[]
}

@InputType()
export class QuestInput {
    @Field(() => String, { nullable: true })
    _id: ObjectId

    @Field({ nullable: true })
    idoId!: number

    @Field({ nullable: true })
    name: string

    @Field({ nullable: true })
    description: string

    @Field(() => OrganizedEventInput, { nullable: true })
    event: OrganizedEventInput

    @Field({ nullable: true })
    icon: string

    @Field({ nullable: true })
    link: string

    @Field({ nullable: true })
    @prop()
    isClaimed: boolean

    @Field(() => QuestType, { nullable: true })
    type: QuestType
}
