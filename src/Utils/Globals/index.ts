import aws from 'aws-sdk'
import { auth, Client } from 'twitter-api-sdk'

export class Globals {
  APP_URL = ''
  API_URL = ''
  DB_HOST = ''
  DB_NAME = ''

  GOOGLE_CLIENT_ID = ''
  GOOGLE_CLIENT_SECRET = ''
  TW_CLIENT_ID = ''
  TW_CLIENT_SECRET = ''

  MAILGUN_USERNAME = ''
  MAILGUN_SMTP_PASSWORD= ''

  REFERRAL_SECRET=''

  JWT_KEY = 'My_key'
  PORT = '4002'
  HOST = 'localhost'
  AdminAddresses = [
    '0x02356b628d108863Baf8644C945d97bAD70190aF5957031F4852D00D0f690a77',
    '0x01945c5e4fd3697fe488236b4dcfc55e8bc4fe3504af6658a2ae135e166bd073',
  ].map((a) => a.toLowerCase())

  s3?: aws.S3
  s3Bucket = ''
  s3Folder = ''
  s3Endpoint = ''
  authClient?: auth.OAuth2User
  twitterClient?: Client
}

export const globals = new Globals()
