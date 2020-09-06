import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Nav from "components/Nav";
import Intro from "pages/Intro";
import Signup from "pages/SignUp";
import Upload from "pages/Upload";
import Processing from "pages/Processing";
import Download from "pages/Download";
import Footer from "components/Footer";
import { repo } from "utils/production";

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Nav />
        <Switch>
          <Route exact path={repo} component={Intro} />
          <Route exact path={`${repo}/signup`} component={Signup} />
          <Route exact path={`${repo}/upload`} component={Upload} />
          <Route exact path={`${repo}/processing`} component={Processing} />
          <Route exact path={`${repo}/download`} component={Download} />
          <Redirect from="*" to={repo} />
        </Switch>
        <Footer />
      </Router>
    );
  }
}

export default Routes;
