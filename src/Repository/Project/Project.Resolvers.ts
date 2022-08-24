import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql'
import { Project, ProjectModel } from './Project.Entity'
import { DocumentType } from '@typegoose/typegoose'
import { UserAccess } from '../../Modules/Auth/AuthChecker'
import { ProjectInput } from './Project.InputTypes'
import { saveProject } from './Project.Services'

@Resolver()
export class ProjectResolvers {
  @Query(() => [Project])
  async searchProjects(
    @Arg('finished', { nullable: true }) finished?: boolean,
    @Arg('search', { nullable: true }) search?: string
  ): Promise<Array<DocumentType<Project>>> {
    const regex = new RegExp(`${search}`, 'ig')
    return await ProjectModel.find({
      ...(search ? { name: regex } : {}),
      isFinished: finished,
    }).exec()
  }

  @Query(() => Project)
  async project(@Arg('idoId') idoId: string): Promise<DocumentType<Project>> {
    return await ProjectModel.findOne({ idoId }).exec()
  }

  @Authorized([UserAccess.Admin])
  @Query(() => [Project])
  async projects(): Promise<Array<DocumentType<Project>>> {
    return await ProjectModel.find({}).exec()
  }

  @Authorized([UserAccess.Admin])
  @Mutation(() => Project, { nullable: true })
  async updateProject(@Arg('data') data: ProjectInput): Promise<Project> {
    return await saveProject(data)
  }
}
