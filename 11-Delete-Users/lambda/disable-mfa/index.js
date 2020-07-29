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

const disableMFA = async (sub) =>
  await new Promise((resolve, reject) => {
    const params = {
      UserPoolId: 'us-east-1_8WMsl8AMg',
      Username: sub,
      SoftwareTokenMfaSettings: {
        Enabled: false,
      },
    }

    cognito.adminSetUserMFAPreference(params, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

const main = async (event) => {
  console.log('Event:', event)

  const { accessToken, sub, userCode } = event

  const validated = await validateMFA(userCode, accessToken)

  if (validated.Status && validated.Status === 'SUCCESS') {
    return await disableMFA(sub)
  }

  return validated
}

exports.handler = main
