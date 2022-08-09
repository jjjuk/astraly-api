import { MiddlewareFn } from 'type-graphql'
import { AppContext } from '../Types/context'
import { globals } from '../Globals'

export const OnlySelfOrAdmin: MiddlewareFn<AppContext> = async ({ args, context }, next) => {
    const { address } = context

    // TODO: Validate subfields
    if (args.adrress) {
        if (!isSelfOrAdmin(args.adrress, address)) {
            throw new Error('OnlySelfOrAdmin: access denied')
        }
    }
    return await next()
}

const isSelfOrAdmin = (_id, address: string): boolean => {
    if (globals.AdminAddresses.includes(address)) {
        return true
    }

    return _id === address
}
