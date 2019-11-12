import { combineReducers } from 'redux';
import azure from './azure'
import datadog from './datadog'

const rootReducer = () => (
  combineReducers({
      azure,
      datadog
  })
);

export default rootReducer
