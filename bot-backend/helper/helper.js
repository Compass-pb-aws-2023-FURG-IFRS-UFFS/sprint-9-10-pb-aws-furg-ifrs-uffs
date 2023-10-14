/**
* Handles response from API. This is used to create response object that can be sent to client
* 
* @param {integer} statusCode  - status code of the response
* @param {string} body - body of the response ( optional ) default is empty string
* 
* @return { object } - the response object
*/
function handleResponse(statusCode, body = "") {

  return {
    "statusCode": statusCode,
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(body)
  }
}


module.exports = { handleResponse }