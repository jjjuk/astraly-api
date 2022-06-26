import { getModelForClass, prop } from '@typegoose/typegoose'

export class AppFile {
    @prop()
    bucket: string

    @prop()
    key: string

    @prop()
    expires: Date

    @prop({ default: false })
    isUsed: boolean

    @prop()
    publicUrl: string
}

export const AppFileModel = getModelForClass(AppFile, {
    schemaOptions: {
        timestamps: true,
        collection: 'files',
    },
})
