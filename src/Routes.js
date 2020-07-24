import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "components/Nav";
import Intro from "pages/Intro";
import Signup from "pages/SignUp";
import Upload from "pages/Upload";
import Processing from "pages/Processing";
import Download from "pages/Download";
import Footer from "components/Footer";

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Nav />
        <Switch>
          <Route exact path="/" component={Intro} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/upload" component={Upload} />
          <Route exact path="/processing" component={Processing} />
          <Route exact path="/download" component={Download} />
        </Switch>
        <Footer />
      </Router>
    );
  }
}

export default Routes;
