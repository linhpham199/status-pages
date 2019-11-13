import { ActionTypes, AzureRegions, AzureServices } from '../constants'

export const initialState = {
  services: Object.values(AzureServices),
  regions: Object.values(AzureRegions),
  errors: [
    // {
    //   service: AzureServices.VIRTUAL_MACHINES,
    //   region: AzureRegions.EAST_US_2
    // },
    // {
    //   service: AzureServices.VIRTUAL_MACHINES,
    //   region: AzureRegions.EAST_US
    // },
    // {
    //   service: AzureServices.AZURE_FUNCTIONS,
    //   region: AzureRegions.EAST_US_2
    // },
  ]
}

export default function azure (state = initialState, action) {
  switch (action.type) {

    case ActionTypes.AZURE_OK:
      return {
        ...state,
      }

    case ActionTypes.AZURE_FAIL:
      return {
        ...state
      }

    case ActionTypes.AZURE_INCIDENTS:
      
      return {
        ...state,
        errors: [...state.errors, action.errorService]    
      }

    default: 
      return state
  }
}