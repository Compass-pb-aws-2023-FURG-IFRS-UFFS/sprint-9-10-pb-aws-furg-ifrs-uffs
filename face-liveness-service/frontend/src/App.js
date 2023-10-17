import './App.css';
import React from "react";
import { ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import FaceLiveness from './Components/FaceLiveness';
import ReferenceImage from './Components/ReferenceImage';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ResultPage from './Components/ResultPage';

import {
  View,
  Flex,
} from '@aws-amplify/ui-react';







function App() {

  const [faceLivenessAnalysis, setFaceLivenessAnalysis] = React.useState(null)

  const getfaceLivenessAnalysis = (faceLivenessAnalysis) => {
    if (faceLivenessAnalysis !== null) {
      setFaceLivenessAnalysis(faceLivenessAnalysis)
    }
  }

  const tryagain = () =>{
    setFaceLivenessAnalysis(null)
  }


  return (
    <Router>
      <ThemeProvider>
        <Flex
          direction="row"
          justifyContent="center"
          alignItems="center"
          alignContent="flex-start"
          wrap="nowrap"
          gap="1rem"
        >
          <View
            as="div"
            maxHeight="600px"
            height="600px"
            width="740px"
            maxWidth="740px"
          >
            <Routes>
              <Route
                path="/"
                element={
                  faceLivenessAnalysis && faceLivenessAnalysis.Confidence ? (
                    <ReferenceImage
                      faceLivenessAnalysis={faceLivenessAnalysis}
                      tryagain={tryagain}
                    />
                  ) : (
                    <FaceLiveness
                      faceLivenessAnalysis={getfaceLivenessAnalysis}
                    />
                  )
                }
              />
            <Route path="/result" element={<ResultPage />} />

            </Routes>
          </View>
        </Flex>
      </ThemeProvider>
    </Router>
  );
};

export default App;