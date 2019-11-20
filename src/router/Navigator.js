import React, { Component } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AzureComponent from '../components/AzureComponent';
import DatadogComponent from '../components/DatadogComponent';
import { Menu } from 'antd'

class Navigator extends Component {
  render() {
    return (
      <Router>
        <Menu mode='horizontal'>
          <Menu.Item><Link to="/azure">AZURE</Link></Menu.Item>
          <Menu.Item><Link to="/datadog">DATADOG</Link></Menu.Item>
        </Menu>
          <Switch>
            <Route path="/azure">
              <AzureComponent />
            </Route>
            <Route path="/datadog">
              <DatadogComponent />
            </Route>
          </Switch>
        
      </Router>
    );
  }
}

export default Navigator;