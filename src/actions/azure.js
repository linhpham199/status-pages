import RSSParser from 'rss-parser'
import { ActionTypes, URL, AzureServices, AzureRegions } from '../constants'

export const fetchAzure_OK = (status) => ({
  type: ActionTypes.AZURE_OK,
  status
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
          console.log('OK')
          dispatch(fetchAzure_OK(feed))

        } else {

          const services = Object.values(AzureServices)
          const regions = Object.values(AzureRegions)

          console.log(services)

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
            console.log(errorServices)

            const errorRegions = regions.filter(region => {
              
              const regEx = new RegExp('\\b' + region)

              return error.title.match(regEx)
            })
            console.log(errorRegions)

            errorServices.forEach(errSer => {
              errorRegions.forEach(errReg => {
                console.log({
                  name: errSer,
                  region: errReg
                })
                return dispatch(fetchAzure_INCIDENTS({
                  service: errSer,
                  region: errReg
                }))
              })
            })
          })

          console.log(errors)
          console.log(services)
          console.log(regions)


          const brokenServices = services.map((item, i) => {

            return {
              

              
            }
          })
          dispatch(fetchAzure_INCIDENTS(brokenServices))
        }
      }
    })
  }
}