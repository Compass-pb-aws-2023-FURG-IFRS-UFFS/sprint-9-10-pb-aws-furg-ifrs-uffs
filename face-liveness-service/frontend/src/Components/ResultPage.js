import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const [isCopied, setIsCopied] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const chatId = queryParams.get('id');

  const handleCopyToken = () => {
    const tokenField = document.getElementById('token-field');

    console.log(chatId)
    if (tokenField) {
      tokenField.select();
      document.execCommand('copy');
      setIsCopied(true);
    }
  };

  if ( !location.state) {
    // Handle the case when location or location.state is undefined
    return (
      <div>
        <h2>Resultado da análise</h2>
        <p>Tivemos alguns problemas no servidor.</p>
        <Link to={{ pathname: '/', search: `?id=${chatId}` }}> Tente novamente</Link>
      </div>
    );
  }

  const { data } = location.state;

  return (
    <div>
      <h2>Resultado</h2>
      {data && data.status === 'SUCCEEDED' && (
        <div>
          <p>Status: Sucesso!</p>
          <div className="token-container">
            <p>Login efetuado! Aguarde a mensagem do BOT</p>
           
          </div>
        </div>
      )}
      {data && data.status !== 'SUCCEEDED' && (
        <div>
          <p>Analise falhou: {data.status}</p>
          <Link to={{ pathname: '/', search: `?id=${chatId}` }}> Tente novamente</Link>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
