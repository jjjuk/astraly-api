import { getModelForClass, prop } from '@typegoose/typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'

export class NewsletterContact {
    @prop()
    email: string

    @prop()
    form: string
}

export const NewsletterContactModel: ModelType<NewsletterContact> = getModelForClass(NewsletterContact, {
    schemaOptions: {
        timestamps: true,
        collection: 'newsletterContacts',
    },
})
