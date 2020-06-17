import React, { useState, useContext } from 'react'
import rp from 'request-promise'

import { AccountContext } from './Accounts'

export default () => {
  const [number, setNumber] = useState(0)

  const { getSession } = useContext(AccountContext)

  const fetchNumber = () => {
    getSession().then(async ({ headers }) => {
      const url =
        'https://yn452m1sf4.execute-api.us-east-1.amazonaws.com/dev/random-number?min=1&max=100'

      console.log(headers)

      const number = await rp(url, { headers })
      setNumber(number)
    })
  }

  return (
    <div>
      <div>Random number: {number}</div>
      <button onClick={fetchNumber}>Fetch new number</button>
    </div>
  )
}
