const AWS = require('aws-sdk')

const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' })

const validateMFA = async (UserCode, AccessToken) =>
  await new Promise((resolve, reject) => {
    const params = {
      AccessToken,
      UserCode,
    }

    cognito.verifySoftwareToken(params, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

const main = async (event) => {
  console.log('Event:', event)
  return validateMFA(event.userCode, event.accessToken)
}

exports.handler = main
