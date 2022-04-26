import React from "react";
import { Route, Redirect } from "react-router-dom";
import { TOKEN } from "../helper";

function PrivateRoute({ component: Component, headerTitle, ...rest }) {
  const token = localStorage.getItem("ANOUSITH_GAME");

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? (
          <div>
            <Component {...props} />
          </div>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default PrivateRoute;
