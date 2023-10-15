
function isImage(content) {
  return content == "image"
}

function isFormatSupported(content) {
  const types = ["png", "jpeg", "mp3", "ogg"]

  return types.includes(content)
}
function isAudio(content) {
  return content == "audio"
}

module.exports = { isAudio, isImage, isFormatSupported }