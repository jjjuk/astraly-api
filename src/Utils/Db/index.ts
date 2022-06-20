import mongoose from 'mongoose'

export const connectToDb = async (dbHost, dbName): Promise<void> => {
  try {
    if (dbHost.includes('ssl=true')) {
      await mongoose.connect(dbHost)
    } else {
      await mongoose.connect(dbHost, {
        dbName,
      })
    }
  } catch (e) {
    throw new Error('Unable to connect to Mongo')
  }
}
