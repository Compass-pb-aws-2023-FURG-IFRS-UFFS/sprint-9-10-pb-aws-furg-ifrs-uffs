// const { ACCOUNT_SID, AUTH_TOKEN } = require("./core/config")
const { isImage, isAudio } = require("./helper/helper")
const querystring = require('querystring');

function handleEvents(event){
  console.log("EVENTO\n\n\n");
  console.log(event);
  console.log("CORPO\n\n\n");
  const body = event.body;
  console.log(event.body)

  // Extrair a URL da imagem da chave 'MediaUrl0' nos dados do formulário
  const formData = querystring.parse(body);
  console.log("FORMATADO\n\n");
  console.log(formData);
  return formData
}

module.exports.handleIntent = async (event, context, next) => {

  // Extrair a URL da imagem da chave 'MediaUrl0' nos dados do formulário
  const formData = handleEvents(event)
  const message = formData["Body"]
  if (message) {
    console.log("É TEXTO\n\n");
    console.log('Conteúdo da mensagem:', message);
  } else {
    const mediaContent = formData["MediaContentType0"].split("/")
    console.log(mediaContent);
    // const id = formData["WaId"]
    const url = formData["MediaUrl0"]

    if (isImage(mediaContent[0])) {
      console.log("É uma imagem");
      // CODE
      console.log('URL\n\n');
      console.log(url);
    }
    if (isAudio(mediaContent[0])) {
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
