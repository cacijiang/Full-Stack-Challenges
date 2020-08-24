var Promise = require("Promise");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

/**
  * FetchModel - Fetch a model from the web server.
  *     url - string - The URL to issue the GET request.
  * Returns: a Promise that should be filled
  * with the response of the GET request parsed
  * as a JSON object and returned in the property
  * named "data" of an object.
  * If the requests has an error the promise should be
  * rejected with an object contain the properties:
  *    status:  The HTTP response status
  *    statusText:  The statusText from the xhr request
  *
*/

function fetchModel(url) {
  return new Promise(function(resolve, reject) {
      console.log(url);
      let request = new XMLHttpRequest();
      // request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.onreadystatechange = () => {
          if(request.readyState === 4) {
              if(request.status !== 200) {
                  reject({"status": request.status, "statusText": request.statusText});
              } else {
                  console.log("success");
                  // resolve({"status": request.status, "statusText": request.statusText, "readyState": request.readyState});
                  resolve({"data": JSON.parse(request.responseText)});
              }
          }
      };
      request.onerror = () => {
          reject({"status": request.status, "statusText": request.statusText}); // error occurred, reject the  Promise
      };
      request.open("GET", url, true);
      request.send();
  });
}

// fetchModel("http://localhost:3000/test/info").then((res) => {
//     console.log("Got data!", res.data["__v"]);
// }).catch((error) => {
//     console.log("Error occurred!", error);
// });

module.exports = {fetchModel};
