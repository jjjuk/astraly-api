import { Field, ID, InputType } from 'type-graphql'
import { ObjectId } from '../../Utils/Types'
import { ProjectType } from './Project.Entity'

@InputType()
export class RoundInput {
    @Field(() => ID, { nullable: true })
    _id: ObjectId

    @Field({ nullable: true })
    title: string

    @Field({ nullable: true })
    description: string

    @Field({ nullable: true })
    startDate: Date

    @Field({ nullable: true })
    endDate: Date
}

@InputType()
export class ProjectDescriptionItemInput {
    @Field({ nullable: true })
    key: string

    @Field({ nullable: true })
    value: string
}

@InputType()
export class ProjectInput {
    @Field(() => ID, { nullable: true })
    _id: ObjectId

    @Field()
    idoId!: string

    @Field({ nullable: true })
    tokenAddress: string

    @Field({ nullable: true })
    voteCount: number

    @Field({ nullable: true })
    created: Date

    @Field({ nullable: true })
    name: string

    @Field({ nullable: true })
    description: string

    @Field({ nullable: true })
    tx: string

    @Field({ nullable: true })
    ticker?: string

    @Field({ nullable: true })
    logo?: string

    @Field({ nullable: true })
    cover?: string

    @Field({ nullable: true })
    coverVideo?: string

    @Field({ nullable: true })
    totalRaise?: number

    @Field({ nullable: true })
    tokenPrice?: number

    @Field({ nullable: true })
    maxAllocation?: number

    @Field(() => ID, { nullable: true })
    currentRoundId: ObjectId

    @Field(() => ProjectType, { nullable: true })
    type?: ProjectType

    @Field(() => [String], { nullable: true })
    categories?: string[]

    @Field(() => [RoundInput], { nullable: 'itemsAndList' })
    rounds: RoundInput[]

    @Field(() => [ProjectDescriptionItemInput], { nullable: 'itemsAndList' })
    projectDescription: ProjectDescriptionItemInput[]

    @Field(() => [ProjectDescriptionItemInput], { nullable: 'itemsAndList' })
    links: ProjectDescriptionItemInput[]

    @Field({ nullable: true })
    admission?: string
}
