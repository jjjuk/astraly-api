[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/astralyxyz)
[![Twitter](https://badgen.net/badge/icon/twitter?icon=twitter&label)](https://twitter.com/AstralyXYZ)

![banner](https://testnet.astraly.xyz/images/home/banner_3d_full.png)

# ☄️ Astraly API

_API for Astraly, Community Engagement and Fundraising platform on Starknet. Learn more about it [here](https://wp.astraly.xyz)._

## Tech Stack

- Koa
- GraphQL
- TypeScript
- AWS S3
- [Checkpoint](https://checkpoint.fyi/#/)

## Project Setup

```
npm install
```

## Compile

```
npm run start / npm run dev (nodemon)
```

#### .env file sample

```
JWT_SECRET=My_key
DATABASE_URL=mysql://root:default_password@localhost:3306/checkpoint
DB_HOST=mongodb://localhost:27017
DB_NAME=astraly-dev
SERVER_PORT=4004
SERVER_HOST=localhost
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=miniosecret
S3_FOLDER=s3folder
S3_BUCKET=s3bucket
S3_IS_MINIO=true
```
