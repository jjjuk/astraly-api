import { Arg, Mutation, Resolver } from 'type-graphql'
import { NewsletterContactModel } from './Newsletter.Entity'
import ApiClient from '@mailchimp/mailchimp_marketing'

@Resolver()
export class FormsResolvers {
  @Mutation(() => Boolean)
  async newsletter(
    @Arg('email') email: string,
    @Arg('form', { nullable: true, defaultValue: 'footer' }) form?: string
  ): Promise<boolean> {
    const _email = email.trim().toLowerCase()
    await NewsletterContactModel.create({
      email: _email,
      form,
    })

    // Add to a newsletter list
    await ApiClient.lists.addListMember('list_id', { email_address: _email, status: 'subscribed' })

    return true
  }
}
