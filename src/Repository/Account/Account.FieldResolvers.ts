import { FieldResolver, Resolver, Root } from 'type-graphql'
import { Account } from './Account.Entity'
import { DocumentType } from '@typegoose/typegoose'
import { AppFileModel } from '../File/File.Entity'
import { isBefore } from 'date-fns'
import { globals } from '../../Utils/Globals'

@Resolver(() => Account)
export class AccountFieldResolvers {
  // TODO: add cache policy
  @FieldResolver(() => String, { nullable: true })
  async cover(@Root() account: DocumentType<Account>): Promise<string | null> {
    return await this._fileFieldResolver(account, 'cover')
  }

  @FieldResolver(() => String, { nullable: true })
  async avatar (@Root() account: DocumentType<Account>): Promise<string | null> {
    return await this._fileFieldResolver(account, 'avatar')
  }

  async _fileFieldResolver (account: DocumentType<Account>, field: 'cover' | 'avatar'): Promise<string | null> {
    if (!account[field]) {
      return null
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
