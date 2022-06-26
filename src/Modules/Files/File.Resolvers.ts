import { Arg, Authorized, Ctx, Query } from 'type-graphql'
import { AppContext } from '../../Utils/Types/context'
import { globals } from '../../Utils/Globals'
import { GraphQLJSON } from 'graphql-type-json'
import { generateFilePath } from './File.Services'
import { addDays } from 'date-fns'
import { AppFileModel } from '../../Repository/File/File.Entity'

export class FileResolvers {
    @Authorized()
    @Query(() => GraphQLJSON)
    async getUploadUrl(@Arg('fileType') fileType: string, @Ctx() { address }: AppContext): Promise<any> {
        const key = `${address}/${generateFilePath(fileType)}`
        const data = await globals.s3.createPresignedPost({
            Bucket: globals.s3Bucket,
            Fields: {
                key, acl: 'public-read', 'ContentType': fileType, 'content-type': fileType
            },
            Conditions: [
                // content length restrictions: 0-1MB]
                ['content-length-range', 0, 1000000],
                ['starts-with', '$Content-Type', 'image/'],
                ['eq', '$Content-Type', fileType],
                ['eq', '$acl', 'public-read']
            ],
            Expires: 15
        })

        const signedUrl = await globals.s3.getSignedUrlPromise('getObject', {
            Bucket: globals.s3Bucket,
            Key: key,
            Expires: 60 * 60 * 24 * 7
        })

        const file = await AppFileModel.create({
            bucket: globals.s3Bucket,
            key,
            expires: addDays(new Date(), 6),
            publicUrl: signedUrl
        })

        return {
            ...data,
            filePath: signedUrl,
            _id: file._id
        }
    }
}
