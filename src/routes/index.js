import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Navbar from "../layouts/Navbar";
import HomePage from "../pages/home/index";
import List from "../pages/list/List";
import AddList from "../pages/list/add";
import Profile from "../pages/profile/Profile";
import BottomNav from "../layouts/BottomNav";
import Login from "../pages/login/Login";
import Detail from "../pages/list/detail";

export default function Routes() {
  return (
    <Router>
      <>
        <Switch>
          <Route exact component={Login} path="/login" />
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

          <Route
            render={({ location, history }) => (
              <>
                <Navbar location={location} history={history} />
                <BottomNav />
                <PrivateRoute
                  path={"/home"}
                  exact
                  component={(props) => <HomePage />}
                />
                <PrivateRoute
                  path={"/list"}
                  exact
                  component={(props) => <List />}
                />
                <PrivateRoute
                  path={"/list/add"}
                  exact
                  component={(props) => <AddList />}
                />
                <PrivateRoute
                  path={"/list/detail/:id/:isPublic"}
                  exact
                  component={(props) => <Detail />}
                />
                <PrivateRoute
                  path={"/lucky/:page"}
                  exact
                  component={(props) => <Profile />}
                />
              </>
            )}
          />
        </Switch>
      </>
    </Router>
  );
}
