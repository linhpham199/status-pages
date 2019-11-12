import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AzureComponent from '../components/AzureComponent';
import DatadogComponent from '../components/DatadogComponent';

class Navigator extends Component {
  render() {
    return (
      <Router>
        <div>
          <Link to="/azure">Azure status</Link>
          <Link to="/datadog">Datadog incidents</Link>

          <Switch>
            <Route path="/azure">
              <AzureComponent />
            </Route>
            <Route path="/datadog">
              <DatadogComponent />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Navigator;