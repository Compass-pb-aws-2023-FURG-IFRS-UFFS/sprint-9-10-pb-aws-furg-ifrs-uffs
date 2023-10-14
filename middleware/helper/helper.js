
function isImage(content) {
  return content.split("/")[0] == "image"
}

function isFormatSupported(content) {
  const types = ["png", "jpeg", "mp3", "ogg"]

  return types.includes(content.split("/")[1])
}
function isAudio(content) {
  return content.split("/")[0] == "audio"
}

module.exports = { isAudio, isImage, isFormatSupported }