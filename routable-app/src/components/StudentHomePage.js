import React, { useState } from 'react';

function CodeInputModal({ isOpen, onCodeSubmit, onClose }) {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (code.length >= 5 && code.length <= 30) {
      onCodeSubmit(code);
      onClose();
    } else {
      alert('Invalid code length. Please enter a code between 5 and 30 characters.');
    }
  };

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <div>
        <p>Please enter a code (5 to 30 characters):</p>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

function StudentHomePage() {
  const [code, setCode] = useState(null);
  const [modalOpen, setModalOpen] = useState(true);

  const handleCodeSubmit = (userInput) => {
    setCode(userInput);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <h1>Welcome to the Code Input Page</h1>
      {code && <p>Code accepted: {code}</p>}

      <CodeInputModal isOpen={modalOpen} onCodeSubmit={handleCodeSubmit} onClose={handleCloseModal} />
    </div>
  );
}

export default StudentHomePage;
