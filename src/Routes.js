import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Intro from "Pages/Intro";
import Signup from "Pages/SignUp";
import Upload from "Pages/Upload";
import Processing from "Pages/Processing";
import Download from "Pages/Download";

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Intro} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/upload" component={Upload} />
          <Route exact path="/processing" component={Processing} />
          <Route exact path="/download" component={Download} />
        </Switch>
      </Router>
    );
  }
}

export default Routes;
