const AWS = require('aws-sdk')
const QR = require('qrcode')

const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' })

const getQRCode = async (AccessToken) =>
  await new Promise((resolve, reject) => {
    cognito.associateSoftwareToken(
      {
        AccessToken,
      },
      (err, result) => {
        if (err) {
          reject(err)
        } else {
          const name = 'Worn Off Keys'
          const uri = `otpauth://totp/${decodeURI(name)}?secret=${
            result.SecretCode
          }`
          console.log(uri)

          QR.toDataURL(uri, (err, result) => {
            if (err) reject(err)
            else resolve(result)
          })
        }
      }
    )
  })

const main = async (event) => {
  console.log('Event:', event)
  return getQRCode(event.accessToken)
}

exports.handler = main
