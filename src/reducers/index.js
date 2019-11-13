import { combineReducers } from 'redux';
import azure from './azureReducer'
import datadog from './datadogReducer'

const rootReducer = () => (
  combineReducers({
      azure,
      datadog
  })
);

export default rootReducer
