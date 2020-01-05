import React from 'react';
import { Account } from './components/Accounts';
import Signup from './components/Signup';
import Login from './components/Login';
import Status from './components/Status';

export default () => {
  return (
    <Account>
      <Status />
      <Signup />
      <Login />
    </Account>
  );
};