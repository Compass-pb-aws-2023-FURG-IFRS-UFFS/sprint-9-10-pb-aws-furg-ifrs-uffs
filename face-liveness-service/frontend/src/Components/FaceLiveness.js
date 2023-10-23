import React, { useState, useEffect } from "react";
import { Loader } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { useNavigate } from "react-router-dom";

function FaceLiveness({ faceLivenessAnalysis }) {
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [matricula, setMatricula] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true); // Set initial state to open modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreateLiveness = async () => {
      if (matricula.trim() === "" || matricula.length < 10) {
        setLoading(false); // Stop loading if matricula is not provided
        return;
      }

      const endpoint = process.env.REACT_APP_BASE_URL;
      console.log(endpoint);

      try {
        const response = await fetch(endpoint + "/create");
        const data = await response.json();
        setSessionId(data.sessionId);
        setLoading(false);
        // Close the modal after fetching data
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchCreateLiveness();
  }, [matricula]);

  const handleAnalysisComplete = async () => {
    const endpoint = process.env.REACT_APP_BASE_URL;
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const response = await fetch(endpoint + "/results", {
        method: "POST",
        body: JSON.stringify({ session: sessionId, student_id: matricula}),
      });

      const data = await response.json();
      faceLivenessAnalysis(data);

      navigate("/result", { state: { data: data } });
    } catch (error) {
      console.error("Error fetching analysis results:", error);
    }
  };


  const handleSubmit = () => {
    // Validate that the input is not empty
    if (matricula.trim() !== "") {
      setIsModalOpen(false);
    } else {
      // Handle validation error (e.g., display an error message)
      alert("Informe uma matricula válida");
    }
  };


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {isModalOpen && (
            <div>
              <h2>Informe sua matricula:</h2>
              <input
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
              />
              <button onClick={handleSubmit}>Enviar</button>
            </div>
          )}

          {!isModalOpen && (
            <FaceLivenessDetector
              sessionId={sessionId}
              region="us-east-1"
              onAnalysisComplete={handleAnalysisComplete}
                disableInstructionScreen={true}
              onError={(error) => {
                console.error(error);
                navigate("/result");

              }}
            />
          )}
        </div>
      )}
    </>
  );
}

export default FaceLiveness;
