function handleResponse(statusCode, message) {
  return {
    "statusCode": statusCode,
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ message: message })
  };
}

function handleImage(extension, url) {
  // logic to handle images
  return "IMAGE MESSAGE RETURN"
}
function handleAudio(extension, url) {
  // logic to handle audio
  return "AUDIO MESSAGE RETURN"
}
module.exports = { handleImage, handleAudio, handleResponse }