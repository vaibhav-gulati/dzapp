import React, { useState } from 'react';
import './App.css'; // Import your custom stylesheet

function App() {
  const [inputValue, setInputValue] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [duplicates, setDuplicates] = useState([]);

  const handleSubmit = () => {
    // Reset error messages and duplicates
    setErrorMessages([]);
    setDuplicates([]);

    // Split input by lines and validate each line
    const lines = inputValue.split('\n');
    const messages = [];
    const addressMap = new Map();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === '') continue; // Skip empty lines

      const [address, amount] = line.split(/[\s,=]+/); // Split by spaces, commas, or equals signs

      let lineError = '';

      // Address length check
      if (address.length !== 42 || !address.startsWith('0x')) {
        lineError += `Invalid Ethereum address`;
      }

      // Amount validation (you can customize this)
      if (amount && !isValidAmount(amount)) {
        lineError += `${lineError ? ' and ' : ''}Invalid amount`;
      }

      if (lineError) {
        messages.push(`Line ${i + 1}: ${lineError}`);
      } else {
        // Check for duplicate addresses
        if (addressMap.has(address)) {
          // Duplicate address found
          const duplicateIndex = addressMap.get(address);
          setDuplicates((prevDuplicates) => [
            ...prevDuplicates,
            { index1: duplicateIndex, index2: i },
          ]);
        } else {
          addressMap.set(address, i);
        }
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

  // Handle keeping the first duplicate
  const handleKeepFirst = (index1, index2) => {
    // Remove the second duplicate from duplicates state
    setDuplicates((prevDuplicates) =>
      prevDuplicates.filter((duplicate) => !(duplicate.index1 === index2 && duplicate.index2 === index1))
    );
  };

  // Handle combining the balance of duplicates
  const handleCombineBalance = (index1, index2) => {
    // Implement your logic to combine the balance of duplicates here
    // You can access the addresses at index1 and index2 to retrieve their amounts and update them as needed.
    // For simplicity, I'm just removing the duplicates here.
    setDuplicates((prevDuplicates) =>
      prevDuplicates.filter((duplicate) => !(duplicate.index1 === index2 && duplicate.index2 === index1))
    );
  };

  return (
    <div className="App">
      <div className="disperse bg-gray-800 p-4">
        <div className="header flex justify-between mb-4">
          <div className="left-header text-white">
            Addresses with amounts
            {/* <input type="file" id="file-upload" className="file-upload ml-2" /> */}
          </div>
          <div className="right-header">
            <label htmlFor="file-upload" className="cursor-pointer">
              Upload File
            </label>
          </div>
        </div>
        <div className="content flex bg-black">
          <div className="left-content text-white flex-shrink-0 w-12 mt-4 pr-2 border-r border-gray-400">
            {Array.from({ length: inputValue.split('\n').length }, (_, i) => (
              <div key={i} className="line-number">
                {i + 1}
              </div>
            ))}
          </div>
          <div className="right-content flex-grow ml-2 bg-black mt-2 mb-2">
            <textarea
              rows="10"
              cols="50"
              placeholder="Enter addresses and amounts here"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full h-full p-2 border-0 rounded focus:outline-none text-white bg-black"
            />
          </div>
        </div>
        <div className="footer mt-4 flex justify-between">
          <div className="left-footer">
            <p className="text-white">Separated by ',' or '=' or ' '</p>
          </div>
        </div>
        {errorMessages.length > 0 && (
          <div className="error-messages mt-4 p-4 border-red-500 border rounded-lg  flex items-left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="red"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div className="text-red-600">
              {errorMessages.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
            </div>
          </div>
        )}
        {duplicates.length > 0 && (
          <div className="duplicates mt-4 p-4 border-gray-500 border rounded-lg  flex items-left">
            <div className="text-red-600">
              {duplicates.map((duplicate, index) => (
                <p key={index}>
                  Duplicate addresses found at lines {duplicate.index1 + 1} and {duplicate.index2 + 1}.
                  <button
                    className="text-blue-600 ml-2"
                    onClick={() => handleKeepFirst(duplicate.index1, duplicate.index2)}
                  >
                    Keep the first one
                  </button>
                  <button
                    className="text-blue-600 ml-2"
                    onClick={() => handleCombineBalance(duplicate.index1, duplicate.index2)}
                  >
                    Combine the balance
                  </button>
                </p>
              ))}
            </div>
          </div>
        )}
        <div className=" mt-4 right-footer w-full">
          <button
            onClick={handleSubmit}
            className={`text-white ${errorMessages.length > 0 ? 'bg-black' : 'bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800'} font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full`}
            disabled={errorMessages.length > 0} // Disable the button when there are errors
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
