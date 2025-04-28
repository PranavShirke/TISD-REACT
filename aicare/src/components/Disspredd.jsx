import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './dispred.css';

const DisPred = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSymptoms(prev => [...prev, value]);
    } else {
      setSymptoms(prev => prev.filter(symptom => symptom !== value));
    }
  };

  const handlePredict = async () => {
    if (symptoms.length === 0) {
      setPrediction("Please select at least one symptom");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/predict', { symptoms });
      setPrediction(response.data.disease);
    } catch (error) {
      console.error("Prediction error:", error);
      setPrediction("Error getting prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const symptomOptions = [
    { value: "fever", label: "Fever", description: "Elevated body temperature" },
    { value: "cough", label: "Cough", description: "Persistent coughing" },
    { value: "sore_throat", label: "Sore Throat", description: "Pain or irritation in throat" },
    { value: "headache", label: "Headache", description: "Pain in head or neck" },
    { value: "fatigue", label: "Fatigue", description: "Extreme tiredness or lack of energy" },
    { value: "nausea", label: "Nausea", description: "Feeling of sickness with urge to vomit" },
    { value: "dizziness", label: "Dizziness", description: "Feeling of lightheadedness or unsteadiness" },
    { value: "rash", label: "Rash", description: "Redness or irritation of the skin" },
    { value: "muscle_pain", label: "Muscle Pain", description: "Aches or discomfort in muscles" },
    { value: "shortness_of_breath", label: "Shortness of Breath", description: "Difficulty breathing or catching breath" }
  ];

  return (
    <div className="dispred-container">
      <div className="dispred-header">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <h1>Disease Predictor</h1>
        <p className="subtitle">Select your symptoms to get a prediction</p>
      </div>
      
      <div className="symptoms-container">
        {symptomOptions.map(({ value, label, description }) => (
          <label key={value} className="symptom-label">
            <input
              type="checkbox"
              value={value}
              checked={symptoms.includes(value)}
              onChange={handleCheckboxChange}
              aria-label={`Select ${label}`}
            />
            <div className="symptom-info">
              <span className="symptom-name">{label}</span>
              <span className="symptom-description">{description}</span>
            </div>
          </label>
        ))}
      </div>

      <button 
        onClick={handlePredict}
        className={`predict-button ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Predicting...' : 'Predict'}
      </button>

      {prediction && (
        <div className="prediction-container">
          <h2>Prediction Result</h2>
          <div className="prediction-result">
            {prediction}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisPred;
