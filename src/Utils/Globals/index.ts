import aws from 'aws-sdk'

export class Globals {
    APP_URL = ''
    API_URL = ''
    DB_HOST = ''
    DB_NAME = ''
    JWT_KEY = 'My_key'
    PORT = '4002'
    HOST = 'localhost'
    AdminAddresses = [
        '0xdd523ab1b6016ebe28da8b68a9585173bb2aac3f',
        '0xb32b2f2ad747c9727256430be751acc68d4a0424',
        '0x25d2e7509fe39a25819fad4a31a1512e206fcc1b',
        '0x2af26b9d454be3768ddd62574738aad05654c181',
        '0x3f2a90e0EBF817650F52119f1b1eBBd2C1867bed',
        '0x8bcf8b38542019b23b523eC847D95F0F66F31FeD',
    ].map((a) => a.toLowerCase())

    s3?: aws.S3
    s3Bucket = ''
    s3Folder = ''
    s3Endpoint = ''
}

export const globals = new Globals()
