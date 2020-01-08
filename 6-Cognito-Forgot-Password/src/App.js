import React from "react";
import { Account } from "./components/Accounts";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Status from "./components/Status";
import Settings from "./components/Settings";

export default () => {
  return (
    <Account>
      <Status />
      <Signup />
      <Login />
      <ForgotPassword />
      <Settings />
    </Account>
  );
};
