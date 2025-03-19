import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import CloudTv from "./CloudTv";

/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <PrivateRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */

function Routes(clouds) {

  return (
      <div>
        <Switch>

          <Route exact path="/">
            <CloudTv clouds={clouds} />
          </Route>

          <Redirect to="/" />
        </Switch>
      </div>
  );
}

export default Routes;
