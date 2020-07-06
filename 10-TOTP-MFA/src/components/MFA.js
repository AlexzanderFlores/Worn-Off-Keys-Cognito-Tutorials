import React, { useEffect, useState, useContext } from 'react'
import { AccountContext } from './Accounts'

export default () => {
  const [userCode, setUserCode] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [image, setImage] = useState('')

  const { getSession } = useContext(AccountContext)

  useEffect(() => {
    getSession().then(({ mfaEnabled }) => {
      setEnabled(mfaEnabled)
    })
  }, [])

  const API = 'https://yn452m1sf4.execute-api.us-east-1.amazonaws.com/dev/mfa'

  const getQRCode = () => {
    getSession().then(({ accessToken, headers }) => {
      if (typeof accessToken !== 'string') {
        accessToken = accessToken.jwtToken
      }

      const uri = `${API}?accessToken=${accessToken}`
      console.log(uri)

      fetch(uri, {
        headers,
      })
        .then((data) => data.json())
        .then(setImage)
        .catch(console.error)
    })
  }

  const enableMFA = (event) => {
    event.preventDefault()

    console.log('USER CODE:', userCode)

    getSession().then(({ user, accessToken, headers }) => {
      if (typeof accessToken !== 'string') {
        accessToken = accessToken.jwtToken
      }

      const uri = `${API}?accessToken=${accessToken}&userCode=${userCode}`
      console.log(uri)

      fetch(uri, {
        method: 'POST',
        headers,
      })
        .then((data) => data.json())
        .then((result) => {
          if (result.Status && result.Status === 'SUCCESS') {
            setEnabled(true)

            const settings = {
              PreferredMfa: true,
              Enabled: true,
            }

            user.setUserMfaPreference(null, settings, () => {})
          } else {
            console.log(result)

            if (result.errorType === 'EnableSoftwareTokenMFAException') {
              alert('Incorrect 6-digit code!')
            } else if (result.errorType === 'InvalidParameterException') {
              alert('Please provide a 6-digit number')
            }
          }
        })
        .catch(console.error)
    })
  }

  const disableMFA = (event) => {
    event.preventDefault()

    getSession().then(({ headers, accessToken }) => {
      if (typeof accessToken !== 'string') {
        accessToken = accessToken.jwtToken
      }

      const uri = `${API}?accessToken=${accessToken}&userCode=${userCode}`
      console.log(uri)

      fetch(uri, {
        method: 'DELETE',
        headers,
      })
        .then((data) => data.json())
        .then(console.log)
        .catch(console.error)
    })
  }

  return (
    <div>
      <h1>Multi-Factor Authentication</h1>

      {enabled ? (
        <div>
          <div>MFA is enabled</div>

          <form onSubmit={disableMFA}>
            <input
              value={userCode}
              onChange={(event) => setUserCode(event.target.value)}
              required
            />

            <button type="submit">Disable MFA</button>
          </form>
        </div>
      ) : image ? (
        <div>
          <h3>Scan this QR code:</h3>
          <img src={image} />

          <form onSubmit={enableMFA}>
            <input
              value={userCode}
              onChange={(event) => setUserCode(event.target.value)}
              required
            />

            <button type="submit">Confirm Code</button>
          </form>
        </div>
      ) : (
        <button onClick={getQRCode}>Enable MFA</button>
      )}
    </div>
  )
}
