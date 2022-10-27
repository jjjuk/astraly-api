import { Quest, QuestModel } from '../Quest/Quest.Entity'
import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql'
import { Project } from './Project.Entity'
import { DocumentType } from '@typegoose/typegoose'
import { AppFileModel } from '../File/File.Entity'
import { isBefore } from 'date-fns'
import { globals } from '../../Utils/Globals'
import { AES } from 'crypto-js'
import { AppContext } from 'Utils/Types/context'

@Resolver(() => Project)
export class ProjectFieldResolvers {
  @FieldResolver(() => [Quest], { nullable: true })
  async quests(@Root() project: DocumentType<Project>): Promise<Array<DocumentType<Quest>>> {
    return await QuestModel.find({
      idoId: project.idoId as unknown as number,
    }).exec()
  }

  @FieldResolver(() => String, { nullable: true })
  async logo(@Root() project: DocumentType<Project>): Promise<string | null> {
    return await this._fileFieldResolver(project, 'logo')
  }

  @FieldResolver(() => String, { nullable: true })
  async cover(@Root() project: DocumentType<Project>): Promise<string | null> {
    return await this._fileFieldResolver(project, 'cover')
  }

  @FieldResolver(() => String, { nullable: true })
  async coverVideo(@Root() project: DocumentType<Project>): Promise<string | null> {
    return await this._fileFieldResolver(project, 'coverVideo')
  }

  @FieldResolver(() => String, { nullable: true })
  referralCode(@Root() project: DocumentType<Project>, @Ctx() ctx: AppContext): string | null {
    if (!ctx.address) return null
    return AES.encrypt(project.idoId + ':' + ctx.id, globals.REFERRAL_SECRET).toString()
  }

  async _fileFieldResolver(
    account: DocumentType<Project>,
    field: 'cover' | 'logo' | 'coverVideo'
  ): Promise<string | null> {
    if (!account[field]) {
      return null
    }

    if (!account[field].match(/^[0-9a-fA-F]{24}$/)) {
      return account[field]
    }

    const file = await AppFileModel.findById(account[field]).exec()

    if (isBefore(file.expires, new Date())) {
      file.publicUrl = await globals.s3.getSignedUrlPromise('getObject', {
        Bucket: file.bucket,
        Key: file.key,
        Expires: 60 * 60 * 24 * 7,
      })

      await file.save()
    }

    return file.publicUrl
  }
}
