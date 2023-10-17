import React from 'react';
import {useLocation} from 'react-router-dom';

const ResultPage = ({ location }) => {
  location = useLocation();
  if (!location || !location.state) {
    // Handle the case when location or location.state is undefined
    return (
      <div>
        <h2>Resultado da análise</h2>
        <p>Tivemos alguns problemas.</p>
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
          <p>Confidence: {data.confidence}</p>
        </div>
      )}
      {data && data.status !== 'SUCCEEDED' && (
        <div>
          <p>Analysis failed with status: {data.status}</p>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
