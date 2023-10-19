import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToken = () => {
    const tokenField = document.getElementById('token-field');

    if (tokenField) {
      tokenField.select();
      document.execCommand('copy');
      setIsCopied(true);
    }
  };

  if (!location || !location.state) {
    // Handle the case when location or location.state is undefined
    return (
      <div>
        <h2>Resultado da análise</h2>
        <p>Tivemos alguns problemas.</p>
        <Link to="/">Tente novamente</Link>
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
            <p>Token de acesso (utilize esse token no bot):</p>
            <input
              type="text"
              id="token-field"
              value={data.token}
              readOnly
            />
            <button onClick={handleCopyToken} className="copy-button">
              {isCopied ? 'Copiado!' : 'Copiar Token'}
            </button>
          </div>
        </div>
      )}
      {data && data.status !== 'SUCCEEDED' && (
        <div>
          <p>Analise falhou: {data.status}</p>
          <Link to="/">Tente novamente</Link>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
