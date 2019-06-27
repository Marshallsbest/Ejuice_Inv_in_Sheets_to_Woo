/*
* Get and save the Clients secret Url and ID
* url "https://countyvape.com/wp-json/wc/v3/products"
*
*/

function addCreds(userObject){
  var prop = PropertiesService.getScriptProperties()
  prop.setProperties({
    "client": userObject.client,
    "secret": userObject.secret,
    "url": userObject.url 
  })
}

function prepApiData(type ,info){
  var prop = PropertiesService.getScriptProperties().getProperties();
  var CLIENT_ID = prop.client;
  var CLIENT_SECRET = prop.secret;
  var url = prop.url;
  
  
  var data = {
    "method": type,
    "headers": {
      "content-type": "application/json",
      "authorization": "Basic "+ CLIENT_ID + CLIENT_SECRET
    },
    "body": {
      "name": info.name,
      "type": info.type,
      "regular_price": "21.99",
    "description": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
    "short_description": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    "categories": [
      {
        "id": "9"
      },
      {
        "id": "14"
      }
    ],
    "images": images
  }
}
}
function makeSimple(url, data){
var response = UrlFetchApp.fetch(
url,
data
)
console.log(response.getContentText())
}