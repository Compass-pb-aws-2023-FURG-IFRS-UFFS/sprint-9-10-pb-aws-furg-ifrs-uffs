const crypto = require("crypto");
const axios = require("axios");

/**
 * Creates a SHA256 hash of a string. Used to verify passwords before they are sent to the server
 *
 * @param {string} str - The string to be hashed
 * @return { string } - The hash as a hex string of
 */
function createHash(str) {
  const hash = crypto.createHash("sha256");
  hash.update(str);
  return hash.digest("hex");
}

/**
 * Fetches a transcription job from a given URL and returns the transcript.
 *
 * @param {string} url - The URL to fetch the transcription job data.
 * @returns {Promise<string>} - A Promise that resolves to the transcript.
 */
async function getTranscriptionJob(url) {
  let transcript = "";

await axios
  .get(url)
  .then((response) => {
    const jsonData = response.data;
    transcript = jsonData.results.transcripts[0].transcript;
  })
  .catch((error) => {
    console.error("Erro ao obter dados JSON:", error);
  });
  console.log("Transcript retorno:", transcript);
  return transcript;
}

module.exports = { createHash, getTranscriptionJob };
