// const { ACCOUNT_SID, AUTH_TOKEN } = require("./core/config")
const { isImage, isAudio, isFormatSupported } = require("./helper/helper")
const querystring = require('querystring');

module.exports.handleIntent = async (event, context, next) => {
  // Obter o corpo da solicitação
  console.log("EVENTO\n\n\n");
  console.log(event);
  console.log("CORPO\n\n\n");
  const body = event.body;
  console.log(event.body)

  // Extrair a URL da imagem da chave 'MediaUrl0' nos dados do formulário
  const formData = querystring.parse(body);
  console.log("FORMATADO\n\n");
  console.log(formData);
  const message = formData['Body'];

  if (message) {
    console.log("É TEXTO\n\n");
    console.log('Conteúdo da mensagem:', message);
  } else {
    const mediaContent = formData["MediaContentType0"]
    console.log(mediaContent);
    // const id = formData["WaId"]
    const url = formData["MediaUrl0"]

    if (isImage(mediaContent)) {
      console.log("É uma imagem");
      // CODE
      console.log('URL\n\n');
      console.log(url);
    }
    if (isAudio(mediaContent)) {
      console.log("É um audio VALIDO");
        // CODE
        console.log('URL\n\n');
        console.log(url);
    }
  }
}


return {
  "statusCode": 200,
  "headers": {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  },
  "body": JSON.stringify({ message: 'Mensagem recebida com sucesso.' })
};
