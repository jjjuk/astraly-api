import { globals } from './index'
import aws from 'aws-sdk'

export const initGlobals = async (): Promise<void> => {
  globals.APP_URL = process.env.APP_URL
  globals.PORT = process.env.PORT
  globals.HOST = process.env.HOST
  globals.DB_HOST = process.env.DB_HOST
  globals.DB_NAME = process.env.DB_NAME
  globals.API_URL = process.env.API_URL
  globals.JWT_KEY = process.env.JWT_KEY

  if (process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) {
    const spacesEndpoint = new aws.Endpoint(process.env.S3_ENDPOINT)

    globals.s3 = new aws.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      // https://docs.min.io/docs/how-to-use-aws-sdk-for-javascript-with-minio-server.html
      s3ForcePathStyle: !!process.env.S3_IS_MINIO,
    })

    globals.s3Bucket = process.env.S3_BUCKET || 'zkpad'
    globals.s3Folder = process.env.S3_FOLDER || 'files'
    globals.s3Endpoint = process.env.S3_ENDPOINT || ''

    globals.s3.createBucket(
      {
        Bucket: globals.s3Bucket,
      },
      () => {}
    )
  }
}
