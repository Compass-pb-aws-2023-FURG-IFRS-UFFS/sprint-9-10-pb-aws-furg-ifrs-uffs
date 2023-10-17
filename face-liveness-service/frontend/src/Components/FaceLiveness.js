import React from "react";
import { useEffect } from "react";
import { Loader } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { useNavigate } from 'react-router-dom'; // Import useHistory

function FaceLiveness({ faceLivenessAnalysis }) {

    const [loading, setLoading] = React.useState(true);
    const [sessionId, setSessionId] = React.useState(null)
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchCreateLiveness = async () => {
            const endpoint = process.env.REACT_APP_BASE_URL 
            console.log(endpoint)
            const response = await fetch(endpoint+'/create');
            const data = await response.json();
            setSessionId(data.sessionId)
            setLoading(false);

            await new Promise((r) => setTimeout(r, 2000));
        };
        fetchCreateLiveness();
    }, [])

    const handleAnalysisComplete = async () => {
        const endpoint = process.env.REACT_APP_BASE_URL
        await new Promise((r) => setTimeout(r, 2000));
        const response = await fetch(endpoint+'/results', {
            method: 'POST',
            body: JSON.stringify({ "session": sessionId })
        });

        const data = await response.json();
        faceLivenessAnalysis(data);

        navigate('/result', { state: { data: data } });
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <FaceLivenessDetector
                    sessionId={sessionId}
                    region="us-east-1"
                    onAnalysisComplete={handleAnalysisComplete}
                    onError={(error) => {
                        console.error(error);
                      }}
                />
            )}
        </>
    );
           
}

export default FaceLiveness;
