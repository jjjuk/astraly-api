import { Arg, Mutation, Resolver } from 'type-graphql'
import { ContactModel } from './Contact.Entity'

@Resolver()
export class ContactResolvers {
  @Mutation(() => Boolean)
  async addContact(@Arg('email') email: string): Promise<boolean> {
    const existingContact = await ContactModel.findOne({
      email: email.toLowerCase(),
    }).exec()

    if (existingContact) {
      return false
    }

    await ContactModel.create({
      email: email.toLowerCase(),
    })

    return true
  }
}
