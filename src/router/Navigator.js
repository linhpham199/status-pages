import React, { Component } from 'react';
import {
  HashRouter as Router,
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
          <p><Link to="/azure">Azure status</Link></p>
          <p><Link to="/datadog">Datadog incidents</Link></p>

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