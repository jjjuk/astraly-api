import { html } from 'common-tags'

export interface ResetPasswordArgs {
  token: string
  timestamp: string
  device: string
}

const resetPassword = (args?: ResetPasswordArgs) => html` <div>Hello bro! ${args}</div> `

export default resetPassword
