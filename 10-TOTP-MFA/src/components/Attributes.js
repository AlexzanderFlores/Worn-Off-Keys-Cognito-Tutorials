import React, { useEffect, useContext, useState } from "react";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { AccountContext } from "./Accounts";

export default () => {
  const [plan, setPlan] = useState("");

  const { getSession } = useContext(AccountContext);

  useEffect(() => {
    getSession().then((data) => {
      setPlan(data["custom:plan"]);
    });
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();

    getSession().then(({ user }) => {
      const attributes = [
        new CognitoUserAttribute({ Name: "custom:plan", Value: plan }),
      ];

      user.updateAttributes(attributes, (err, result) => {
        if (err) console.error(err);
        console.log(result);
      });
    });
  };

  return (
    <div>
      <h1>Update your plan:</h1>
      <form onSubmit={onSubmit}>
        <input value={plan} onChange={(event) => setPlan(event.target.value)} />

        <button type="submit">Change plan</button>
      </form>
    </div>
  );
};
