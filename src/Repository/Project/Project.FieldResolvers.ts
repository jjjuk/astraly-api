import { Quest, QuestModel } from '../Quest/Quest.Entity'
import { FieldResolver, Resolver, Root } from 'type-graphql'
import { Project } from './Project.Entity'
import { DocumentType } from '@typegoose/typegoose'

@Resolver(() => Project)
export class ProjectFieldResolvers {
    @FieldResolver(() => [Quest], { nullable: true })
    async quests(@Root() project: DocumentType<Project>): Promise<Array<DocumentType<Quest>>> {
        return await QuestModel.find({
            idoId: project.idoId as unknown as number
        }).exec()
    }
}
