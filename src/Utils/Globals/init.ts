import { globals } from './index'
import aws from 'aws-sdk'
import { Client, auth } from 'twitter-api-sdk'
import ApiClient from '@mailchimp/mailchimp_marketing'

export const initGlobals = async (): Promise<void> => {
  globals.APP_URL = process.env.APP_URL
  globals.PORT = process.env.PORT
  globals.HOST = process.env.HOST
  globals.DB_HOST = process.env.DB_HOST
  globals.DB_NAME = process.env.DB_NAME
  globals.API_URL = process.env.API_URL
  globals.JWT_KEY = process.env.JWT_SECRET

  globals.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  globals.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

  globals.TW_CLIENT_ID = process.env.TW_CLIENT_ID
  globals.TW_CLIENT_SECRET = process.env.TW_CLIENT_SECRET

  globals.MAILGUN_USERNAME = process.env.MAILGUN_USERNAME
  globals.MAILGUN_SMTP_PASSWORD = process.env.MAILGUN_SMTP_PASSWORD

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

  if (process.env.TW_CLIENT_ID && process.env.TW_CLIENT_SECRET) {
    globals.authClient = new auth.OAuth2User({
      client_id: process.env.TW_CLIENT_ID,
      client_secret: process.env.TW_CLIENT_SECRET,
      callback: `${globals.API_URL}/twitter-callback`,
      scopes: ['tweet.read', 'users.read', 'follows.read'],
    })
    const _client = new Client(globals.authClient)
    globals.twitterClient = _client
  }

  if (process.env.MAIL_API_KEY) {
    ApiClient.setConfig({
      apiKey: process.env.MAIL_API_KEY,
      server: 'us17',
    })
  }
}
