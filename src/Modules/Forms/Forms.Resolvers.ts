import { Arg, Mutation, Resolver } from 'type-graphql'
import { NewsletterContactModel } from './Newsletter.Entity'

@Resolver()
export class FormsResolvers {
    @Mutation(() => Boolean)
    async newsletter (
        @Arg('email') email: string,
        @Arg('form', { nullable: true, defaultValue: 'footer' }) form?: string
    ): Promise<boolean> {
        await NewsletterContactModel.create({
            email: email.trim().toLowerCase(),
            form
        })

        // TODO: add to a newsletter list

        return true
    }
}
