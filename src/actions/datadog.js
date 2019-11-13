import RSSParser from 'rss-parser'
import { URL, ActionTypes } from '../constants'

export const fetchDatadog_OK = () => ({
  type: ActionTypes.DATADOG_OK
})

export const fetchDatadog_FAIL = () => ({
  type: ActionTypes.DATADOG_FAIL
})

export const fetchDatadog_INCIDENTS = (errorService) => ({
  type: ActionTypes.DATADOG_INCIDENTS,
  errorService
})

export function fetchDatadogStatus() {
  return (dispatch) => {
    let parser = new RSSParser()

    parser.parseURL(URL.CORS_PROXY + URL.DATADOG_RSS, (err, feed) => {
      if (err) {
        dispatch(fetchDatadog_FAIL())
        throw err
      } else {
          dispatch(fetchDatadog_OK())

          const incidents = feed.items.slice(0, 5)

          incidents.forEach(incident => {
            dispatch(fetchDatadog_INCIDENTS({
              title: incident.title,
              content: incident.content
            }))
          })
          console.log(incidents)
        }
      
    })
  }
}