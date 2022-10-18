import { AuthChecker } from 'type-graphql'
import { AppContext } from '../../Utils/Types/context'
import { globals } from '../../Utils/Globals'

export enum UserAccess {
  User = 'User',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
}

export const appAuthChecker: AuthChecker<AppContext, UserAccess> = ({ context }, roles: UserAccess[]) => {
  const { id } = context

  return hasUserAccess(id, roles)
}

export const hasUserAccess = (id: string | null | undefined, roles: UserAccess[]): boolean => {
  if (!id) {
    return false
  }

  if (roles.length === 0) {
    return true
  }

  return globals.AdminAddresses.includes(id)
}
