import { createTransport, Transporter } from 'nodemailer'
import resetPassword, { ResetPasswordArgs } from './templates/resetPassword'

export interface MailerProps {
  username: string
  password: string
  ssl?: boolean
}

interface SendPasswordResetArgs {
  to: string
  template?: ResetPasswordArgs
}

export default class Mailer {
  private transporter: Transporter
  public constructor(public props: MailerProps) {
    this.transporter = createTransport({
      host: 'smtp.mandrillapp.com',
      port: props?.ssl ? 465 : 587,
      auth: {
        user: props.username,
        pass: props.password,
      },
    })
  }

  public sendPasswordReset(args: SendPasswordResetArgs) {
    return this.transporter
      .sendMail({
        to: args.to,
        html: resetPassword(args.template),
      })
      .catch(console.error)
  }
}
