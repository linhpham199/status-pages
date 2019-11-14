This is a Reac-Redux application that lists different status pages and shows particular values from those pages. Automatic refresh once every 10 minutes.

## Data

The data was retrieved from 2 sources: [Azure status page](https://status.azure.com/en-us/status) and [Datadog status page](https://status.datadoghq.com/).

As the 2 mentioned websites do not provide API, I must find another solutions to get the data. I found out 2 other alternatives to API which are web-scraping and RSS. However, web-scraping is not a sustainable solution in this case. Because if the web page changes its structure, the data cannot be retrieved correctly anymore; on top of that, it will be more complicated in case of updating data every 10 minutes. So RSS was my final decision.

## 1. Code insights and explanations

### Code structure

Codes are organized in Rails styles which means files are grouped together by their functions. 

    `src
      ├── actions                   # Actions files of redux
      ├── components                # Components of application (to render view)
      ├── constants                 # Global constants store
      ├── reducers                  # Redux reducers
      ├── router                    # Navigation
      ├── App.js
      └── index.js`
Hereby I will go to each folder for better explanation.

### ├── constants

Here stores constants files which are shared among some other files in the applications. Putting those contants in the same folder makes application scalable, maintainable and reusable without any typing mistakes.

### ├── reducers

Here stores redux reducers. Different files are created for different services.

##### `azureReducer.js`

I came up with some options for data structure of Azure data in store and I should decide which one is the best option. After some consideration, I decided to have the services and regions as 2 different arrays, and another array is errors array which is used to store error objects (if there is any). With this solutions, it is easy to add new services or new regions and also, easy to render for the view.

```javascript
import { ActionTypes, AzureRegions, AzureServices } from '../constants'

export const initialState = {
  services: Object.values(AzureServices), // Storing Azure services need to be rendered
  regions: Object.values(AzureRegions),   // Storing regions need to be rendered along with those services
  errors: []                              // Storing objects {service: '', region: ''} of error services
}
```
The initial services and regions are extracted from `AzureServices.js` and `AzureRegions.js` constants files by using `Object.values()` method. By doing this, whenever someone wants to add more services or more regions to display in the application, they could simply go to `constant` folder and add new service/region in the approriate files. The rest of the application will then run normally and render with new service/region. They don't have to worry about forgetting to add new service in any other files.

### ├── actions

##### `azure.js`

```javascript
let parser = new RSSParser() //Used to parse RSS to Javascript objects.
```
```javascript
 if (feed.items.length === 0) {
    dispatch(fetchAzure_OK())
 } else {
  // Codes showed below
 }
```
As Azure status page RSS feed returns nothing if there is no problem, so I need to check `feed.item.length`. If there are some problems, codes and explanations are shown below.

```javascript
// Retrieving services and regions from constants folder
const services = Object.values(AzureServices)
const regions = Object.values(AzureRegions)

// `errors` array stores errors services which are retrieving from RSS feed
// As the application only needs certain services, I iterate through the `feed.items` array to find any item that contains those services in the title
let errors = feed.items.filter(item => {
  return services.find(service => item.title.includes(service))
})

// Now the `errors` array only store item problems that concern our services
// After that, I iterate through the `errors` array to find in those item problems which one happened in our regions.
errors = errors.filter(item => {
  return regions.find(region => item.title.includes(region))
})

// Now we are left with `errors` array which stores problem with our services happened in our regions.

// Below I extract the service names and region names from each item's title in `errors` array
errors.forEach(error => {
  
  // Here I pick out any services mentioned in title of this item and put in `errorServices` array
  const errorServices = services.filter(service => {
    return error.title.includes(service)
  })
  
  // Here I pick out any regionss mentioned in title of this item and put in `errorRegions` array
  const errorRegions = regions.filter(region => {
    const regEx = new RegExp('\\b' + region + '( \\D)') // RegEx is explained later
    const regEx2 = new RegExp('\\b' + region + '$')

    return error.title.match(regEx) || error.title.match(regEx2)
  })

  // Match service with region and dispatch to reducer
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
```

##### Why I checked `item.title` to find services and regions?
During the time I built the application, there was never anything wrong with Azure services so the RSS feed never sent back anything. So I was not sure about the structure of the data which will be sent if anything happens. I checked Azure documents but could not find any examples. Luckily, I found some examples on the other websites and also [Azure history page](https://status.azure.com/en-us/status/history/). Even though the format of those example data is different (because of difference in time posted), but it always has the title in common. Therefore, I decided to use the title to find needed services and regions.

##### Why I created `errorServices` and `errorRegions` array when iterating through each error?
As I checked some examples, the error title can report problem of 1 service in 1 region, OR 1 service in many regions, OR many services in 1 region, OR many services in many regions (total 4 cases). So I extracted services and regions in each title and push them to 2 different arrays. Later I can iterate the arrays and match each service with each region as object {service: '', regions: ''} and dispatch to the store.

##### RegEx explanation
For example, an error title like this: "There are problems with Virtual Machines in East US 2 last night."

When extracting error regions in the title to push to `errorRegions` array, it can easily be mistaken. Even though there is only 'East US 2' region in the title, the 'East US' can also be extracted from the title as 'East US' string is part of it.

To prevent this from happening, I use those 2 regex.

```javascript
const regEx = new RegExp('\\b' + region + '( \\D)')
```
This one is to find any region which following it in the title is a character, not digit. In the example above, 'East US' can not be extracted because a number follows it => Only the exact 'East US 2' is pushed into `errorRegions`.

```javascript
const regEx2 = new RegExp('\\b' + region + '$')
```
This one for the case when the regions are mentioned at the end of the title.

### ├── components

##### `azureComponent.js`

```javascript
{services.map((service, i) => {
  return (
    <div key={i}>
      <h2>{service}</h2>
      {regions.map((region, i) => <p key={i}>{region}: {this.checkStatus(service, region)}</p>)}
    </div>
  )
})}
```
When iterating through `services` and `regions` array to render, function `checkStatus()` will help to check if that pair of {service, region} is in `errors` array of the store. If yes, then it will render 'ERROR' on the view; else, it will render 'GOOD'

```javascript
checkStatus(service, region) {
  const { errors } = this.state
  return errors.find((error) =>
    error.service === service && error.region === region)
    ? <span style={{color: 'red'}}>ERROR</span>
    : 'GOOD'
}
```
______________
The Datadog status page implementation is quite straigthforward and simple so I don't go to any details here.

## 2. Adding new status page
In order to add new status page, please follow these steps:

1. Go to `reducers` folder, create new reducer for your service, and include that reducer in `reducers/index.js` file.
2. Go to `actions` folder, create new action file for your service. 
3. Go to `constants` folder, add new action types for your service in `ActionTypes.js` file. Any other constants that will be shared among many files, please create an approriate file for them under this folder.
4. Go to `components` folder, create new file in order to display your service in the application.
5. Go to `router/Navigation.js` and include your view component in the router.

## 3. Time
The application was built in approximately 9 hours.

