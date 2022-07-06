// import checkpoints from './checkpoints.json'
import config from './config.json'
import Checkpoint, { LogLevel } from '@snapshot-labs/checkpoint'
import * as writer from './writer'

export const initCheckpoint = async (): Promise<void> => {
  const checkpoint = new Checkpoint(config, writer, `scalar Id`, {
    logLevel: LogLevel.Info,
    prettifyLogs: process.env.NODE_ENV !== 'production',
  })

  await checkpoint.reset()

  // checkpoint.seedCheckpoints(checkpoints).then(() => checkpoint.start())
  await checkpoint.start()
}
