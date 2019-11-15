import RSSParser from 'rss-parser'
import { ActionTypes, URL, AzureServices, AzureRegions } from '../constants'

export const fetchAzure_OK = () => ({
  type: ActionTypes.AZURE_OK
})

export const fetchAzure_FAIL = () => ({
  type: ActionTypes.AZURE_FAIL
})

export const fetchAzure_INCIDENTS = (errorService) => ({
  type: ActionTypes.AZURE_INCIDENTS,
  errorService
})

export function fetchAzureStatus() {
  return (dispatch) => {
    let parser = new RSSParser()

    parser.parseURL(URL.CORS_PROXY + URL.AZURE_RSS, (err, feed) => {
      if (err) {

        dispatch(fetchAzure_FAIL())
        throw err

      } else {

        if (feed.items.length === 0) {
          dispatch(fetchAzure_OK())
        } else {

          const services = Object.values(AzureServices)
          const regions = Object.values(AzureRegions)

          let errors = feed.items.filter(item => {
            return services.find(service => item.title.includes(service))
          })

          errors = errors.filter(item => {
            return regions.find(region => item.title.includes(region))
          })

          errors.forEach(error => {
            const errorServices = services.filter(service => {
              return error.title.includes(service)
            })

            const errorRegions = regions.filter(region => {
              const regEx = new RegExp('\\b' + region + '( \\D)')
              const regEx2 = new RegExp('\\b' + region + '$')

              return error.title.match(regEx) || error.title.match(regEx2)
            })

            errorServices.forEach(errSer => {
              errorRegions.forEach(errReg => {
                return dispatch(fetchAzure_INCIDENTS({
                  service: errSer,
                  region: errReg
                }))
              })
            })
          })
        }
      }
    })
  }
}