import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ResultPage = ({ location }) => {
  location = useLocation();
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
      <h2>Result Page</h2>
      {data && data.status === 'SUCCEEDED' && (
        <div>
          <p>Status: {data.status}</p>
          {/* <p>Confidence: {data.confidence}</p> */}
          <p>Key: {data.token}</p>
        </div>
      )}
      {data && data.status !== 'SUCCEEDED' && (
        <div>
          <p>Analise falhou: {data.status}</p>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
