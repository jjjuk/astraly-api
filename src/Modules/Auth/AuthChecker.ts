import { AuthChecker } from 'type-graphql'
import { AppContext } from '../../Utils/Types/context'
import { globals } from '../../Utils/Globals'

export enum UserAccess {
  User = 'User',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
}

export const appAuthChecker: AuthChecker<AppContext, UserAccess> = ({ context }, roles: UserAccess[]) => {
  const { address } = context

  return hasUserAccess(address, roles)
}

export const hasUserAccess = (address: string | null | undefined, roles: UserAccess[]): boolean => {
  if (!address) {
    return false
  }

  if (roles.length === 0) {
    return true
  }

  return globals.AdminAddresses.includes(address)
}
