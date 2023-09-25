import React, { useState } from 'react';
import './App.css'; // Import your custom stylesheet

function App() {
  const [inputValue, setInputValue] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);

  const handleSubmit = () => {
    // Reset error messages
    setErrorMessages([]);

    // Split input by lines and validate each line
    const lines = inputValue.split('\n');
    const messages = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === '') continue; // Skip empty lines

      const [address, amount] = line.split(/[\s,=]/);

      // Address length check
      if (address.length !== 42) {
        messages.push(`Error at line ${i + 1}: Address must be 42 characters long.`);
      }

      // Address format check
      if (!address.startsWith('0x')) {
        messages.push(`Error at line ${i + 1}: Address must start with '0x'.`);
      }

      // Amount validation (you can customize this)
      if (amount && !isValidAmount(amount)) {
        messages.push(`Error at line ${i + 1}: Invalid amount.`);
      }
    }

    if (messages.length === 0) {
      // Process valid input here
      alert('Input is valid. Processing...');
    } else {
      // Set error messages
      setErrorMessages(messages);
    }
  };

  // Function to validate the amount (customize as needed)
  const isValidAmount = (amount) => {
    const regex = /^[0-9]+$/; // Example: Allow only positive integers
    return regex.test(amount);
  };

  return (
    <div className="App">
      <div className="disperse bg-gray-200 p-4">
        <div className="header flex justify-between mb-4">
          <div className="left-header">
            Addresses with amounts
            <input type="file" id="file-upload" className="file-upload ml-2" />
          </div>
          <div className="right-header">
            <label htmlFor="file-upload" className="cursor-pointer">Upload File</label>
          </div>
        </div>
        <div className="content flex">
          <div className="left-content flex-shrink-0 w-12">
            {Array.from({ length: inputValue.split('\n').length }, (_, i) => (
              <div key={i} className="line-number">
                {i + 1}
              </div>
            ))}
          </div>
          <div className="right-content flex-grow ml-2">
            <textarea
              rows="10"
              cols="50"
              placeholder="Enter addresses and amounts here"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full h-full p-2 border rounded focus:outline-none"
            />
          </div>
        </div>
        <div className="footer mt-4">
          <div className="left-footer">
            Separated by '='
          </div>
          <div className="right-footer">
            <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 focus:outline-none">
              Next
            </button>
          </div>
        </div>
        <div className="error-messages mt-4">
          {errorMessages.map((message, index) => (
            <p key={index} className="text-red-500">
              {message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
