import { ActionTypes, AzureRegions, AzureServices } from '../constants'

export const initialState = {
  status: null,
  services: [AzureServices.VIRTUAL_MACHINES, AzureServices.CLOUD_SERVICES, AzureServices.AZURE_FUNCTIONS],
  regions: [AzureRegions.EAST_US, AzureRegions.EAST_US_2, AzureRegions.NORTH_EU],
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
        ...initialState,
        status: action.status
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