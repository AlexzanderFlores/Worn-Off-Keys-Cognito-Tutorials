import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './Accounts';

export default () => {
  const [status, setStatus] = useState(false);

  const { getSession, logout } = useContext(AccountContext);

  useEffect(() => {
    getSession()
      .then(session => {
        console.log('Session:', session);
        setStatus(true);
      })
  }, []);

  return (
    <div>
      {status ? (
        <div>
          You are logged in.
          <button onClick={logout}>Logout</button>
        </div>
      ) : 'Please login below.'}
    </div>
  );
};