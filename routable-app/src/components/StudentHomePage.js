import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosInstance';
import '../styles/StudentHomePage.css';

function CodeInputModal({ isOpen, onCodeSubmit, onClose, codeSubmitted }) {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (code.length >= 5 && code.length <= 30) {
      onCodeSubmit(code);
      setCode('');
    } else {
      alert('Invalid code length. Please enter a code between 5 and 30 characters.');
    }
  };

  if (!isOpen || codeSubmitted) {
    return null;
  }

  return (
    <div className={`code-input-modal open`}>
      <div>
        <p>Please enter a code (5 to 30 characters):</p>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

function StudentHomePage() {
  const [code, setCode] = useState('');
  const [modalOpen, setModalOpen] = useState(true);
  const [error, setError] = useState(null);
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [activity, setActivity] = useState(null);

  const handleCodeSubmit = useCallback(async (userInput) => {
    try {
      const response = await axiosInstance.get(`/activities?filter=${userInput}`);
      if (response.data.length > 0) {
        const newActivity = response.data[0];
        const currentDate = new Date();
        const formattedDate = new Date().toISOString().slice(0, 10);
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const currentTime = `${hours}:${minutes}`;
        const activityDate = new Date(newActivity.date).toISOString().slice(0, 10);
        const activityStartTime = newActivity.startTime;
        const activityEndTime = newActivity.endTime;

        if (newActivity.uniqueCode) {
          if (
            formattedDate === activityDate &&
            currentTime >= activityStartTime &&
            currentTime <= activityEndTime
          ) {
            setActivity(newActivity);
            setError(null);
            setCodeSubmitted(true);
          } else {
            setError('Activity is expired or in the future'); // Badge
          }
        }
      } else {
        setError('Activity not found for the provided code.'); // Badge
      }
    } catch (error) {
      setError('Error getting activity. Please try again.'); // Badge
    }
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFeedback = async (uniqueCode, reactType) => {
    try {
      const response = await axiosInstance.post(`/activities/${uniqueCode}/feedback`, {
        reactType: reactType,
        uniqueCode: uniqueCode,
        reactTime: new Date().toISOString(),
      });
      console.log('Feedback saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  useEffect(() => {
    if (code.length > 0) {
      handleCodeSubmit(code);
    }
  }, [code, handleCodeSubmit]);

  return (
    <div>
      {error && <p className="error">{error}</p>}

      <CodeInputModal
        isOpen={modalOpen}
        onCodeSubmit={(code) => setCode(code)}
        onClose={handleCloseModal}
        codeSubmitted={codeSubmitted}
      />

      <div className="activities-container">
        {codeSubmitted && activity && (
          <div>
            <h2>Activity details:</h2>
            <p>Activity Name: {activity.name}</p>
            <p>Activity Description: {activity.description}</p>
            <p>Code: {activity.uniqueCode}</p>
            <p>Start Time: {activity.startTime}</p>
            <p>End Time: {activity.endTime}</p>
            <p>Date: {new Date(activity.date).toISOString().slice(0, 10)}</p>
            <p>Feedback: </p>
            <div>
              <button onClick={() => handleFeedback(activity.uniqueCode, 'Smiley')}>😀</button>
              <button onClick={() => handleFeedback(activity.uniqueCode, 'Frowny')}>☹️</button>
              <button onClick={() => handleFeedback(activity.uniqueCode, 'Surprised')}>😲</button>
              <button onClick={() => handleFeedback(activity.uniqueCode, 'Confused')}>😕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentHomePage;
