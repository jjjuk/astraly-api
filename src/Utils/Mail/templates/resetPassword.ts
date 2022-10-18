import { html } from 'common-tags'
import { format } from 'date-fns'
import { globals } from '../../Globals'

import { join } from 'node:path'

export interface ResetPasswordArgs {
  token: string
  timestamp: Date
  device: string
}

const resetPassword = ({ token, timestamp, device }: ResetPasswordArgs): string => {
  const url = new URL(`${globals.APP_URL}/password-reset`)
  url.searchParams.set('token', token)
  // console.log(url.toString())
  return html`<html>
    <head>
      <style type="text/css">
        @media screen {
          @font-face {
            font-family: 'Avenir Next';
            src: url('${globals.API_URL}/static/fonts/AvenirNext/AvenirNextLTPro-Regular.otf');
            font-weight: 400;
            font-style: normal;
          }

          @font-face {
            font-family: 'Avenir Next';
            src: url('${globals.API_URL}/static/fonts/AvenirNext/AvenirNextLTPro-Bold.otf');
            font-weight: 700;
            font-style: normal;
          }

          @font-face {
            font-family: 'Druk Wide Web';
            src: url('${globals.API_URL}/static/fonts/DrukWideWeb/DrukWide-Bold-Reduced.woff.ttf');
            weight: 700;
            style: normal;
          }

          #reset-button:hover {
            background: linear-gradient(360deg, #9f24ff 0%, #7e1aff 50%) !important;
          }
        }
      </style>
    </head>
    <body>
      <div style="background-color: #fbf7ff; border-radius: 23px; width: 843px; height: 480px">
        <table style="width: 843px">
          <tr style="height: 124px; text-align: center">
            <td id="spacer-1" style="width: 90px"></td>
            <td style="width: 380px">
              <table>
                <tr>
                  <td style="padding-left: 16px"><img src="cid:astr-logo" /></td>
                  <td style="padding-left: 16px">
                    <img src="cid:astr-logo-text" />
                  </td>
                </tr>
              </table>
            </td>
            <td id="spacer-2" style="width: 73px"></td>
            <td id="spacer-3"></td>
          </tr>
          <tr>
            <td id="spacer-6"></td>
            <td id="email-body" rowspan="6" style="vertical-align: top">
              <div
                style="
                background-color: #ffff;
                padding: 32px;
                border-radius: 32px;
                margin-bottom: -200px;
                box-shadow: 0px 21px 21px rgb(55 0 99 / 6%);
                font-family: Avenir Next, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
                  Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
                  'Segoe UI Symbol', 'Noto Color Emoji';
              "
              >
                <h2>Password reset</h2>
                <p style="text-align: center">
                  If you've lost your password or wish to reset it, use the link below to get started. <br />
                  <br />
                  The reset request was made with ${device} device at ${format(timestamp, 'do MMM p')}.
                </p>
                <a href="${url.toString()}" target="_blank"
                  ><button
                    id="reset-button"
                    style="
                    width: 100%;
                    background: linear-gradient(360deg, #7e1aff 0%, #9f24ff 50%);
                    border: 0px;
                    height: 56px;
                    border-radius: 16px;
                    color: #ffffff;
                    font-family: Avenir Next, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
                      'Segoe UI Symbol', 'Noto Color Emoji';
                    font-size: 20px;
                    font-weight: 700;
                    cursor: pointer;
                  "
                  >
                    Reset Your Password
                  </button></a
                >
              </div>
            </td>
            <td id="divider" style="vertical-align: top; padding-left: 32px; padding-right: 32px">
              <img src="cid:divider" />
            </td>
            <td style="vertical-align: top">
              <table
                style="
                color: #8a6ab1;
                font-family: 'Aeonik';
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                line-height: 28px;
              "
              >
                <tr id="twitter" style="height: 56px">
                  <td>
                    <a href=""
                      ><table>
                        <tr>
                          <td>
                            <img src="cid:twitter" />
                          </td>
                          <td
                            style="
                            padding-left: 8px;
                            font-family: Avenir Next, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
                              'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
                              'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
                          "
                          >
                            Twitter
                          </td>
                        </tr>
                      </table></a
                    >
                  </td>
                </tr>
                <tr id="telegram" style="height: 56px">
                  <td>
                    <a href=""
                      ><table>
                        <tr>
                          <td>
                            <img src="cid:telegram" />
                          </td>
                          <td
                            style="
                            padding-left: 8px;
                            font-family: Avenir Next, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
                              'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
                              'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
                          "
                          >
                            Telegram
                          </td>
                        </tr>
                      </table></a
                    >
                  </td>
                </tr>
                <tr id="discord" style="height: 56px">
                  <td>
                    <a href=""
                      ><table>
                        <tr>
                          <td>
                            <img src="cid:discord" />
                          </td>
                          <td
                            style="
                            padding-left: 8px;
                            font-family: Avenir Next, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
                              'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
                              'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
                          "
                          >
                            Discord
                          </td>
                        </tr>
                      </table></a
                    >
                  </td>
                </tr>
                <tr>
                  <td id="spacer-4" style="height: 80px"></td>
                </tr>
                <tr>
                  <td
                    style="
                    font-family: Avenir Next, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
                      'Segoe UI Symbol', 'Noto Color Emoji';
                  "
                  >
                    © 2022 Astraly Labs, Inc.
                  </td>
                </tr>
                <tr>
                  <td id="spacer-5"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </body>
  </html> `
}

export const attachments = [
  {
    filename: 'astr-logo.png',
    path: join(__dirname, '../../../../static/images/astr-logo.png'),
    cid: 'astr-logo',
  },
  {
    filename: 'astr-logo-text.png',
    path: join(__dirname, '../../../../static/images/astr-logo-text.png'),
    cid: 'astr-logo-text',
  },
  {
    filename: 'divider.png',
    path: join(__dirname, '../../../../static/images/divider.png'),
    cid: 'divider',
  },
  {
    filename: 'discord.png',
    path: join(__dirname, '../../../../static/images/discord.png'),
    cid: 'discord',
  },
  {
    filename: 'telegram.png',
    path: join(__dirname, '../../../../static/images/telegram.png'),
    cid: 'telegram',
  },
  {
    filename: 'twitter.png',
    path: join(__dirname, '../../../../static/images/twitter.png'),
    cid: 'twitter',
  },
]

export default resetPassword
