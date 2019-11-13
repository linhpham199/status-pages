import { ActionTypes } from "../constants"

export const initialState = {
  status: null,
  incidents: []
}

export default function datadog (state = initialState, action) {
  switch (action.type) {

    case ActionTypes.DATADOG_OK:
      return {
        ...initialState
      }
    
    case ActionTypes.DATADOG_FAIL:
      return {
        ...state
      }

    case ActionTypes.DATADOG_INCIDENTS:
      return {
        ...state,
        incidents: [...state.incidents, action.errorService]
      }

    default: 
      return state
  }
}