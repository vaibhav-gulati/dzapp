import React, { useState } from 'react';
import './App.css'; 

function App() {
  const [inputValue, setInputValue] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = () => {
    setErrorMessages([]);
    setDuplicates([]);
    const lines = inputValue.split('\n');
    const messages = [];
    const addressMap = new Map();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === '') continue; 

      const [address, amount] = line.split(/[\s,=]+/);

      let lineError = '';
      if (address.length !== 42 || !address.startsWith('0x')) {
        lineError += `Invalid Ethereum address`;
      }
      if (amount && !isValidAmount(amount)) {
        lineError += `${lineError ? ' and ' : ''}Invalid amount`;
      }

      if (lineError) {
        messages.push(`Line ${i + 1}: ${lineError}`);
      } else {
        if (addressMap.has(address)) {
          const duplicateIndex = addressMap.get(address);
          setDuplicates((prevDuplicates) => [
            ...prevDuplicates,
            { index1: duplicateIndex, index2: i, address },
          ]);
        } else {
          addressMap.set(address, i);
        }
      }
    }

    if (messages.length === 0) {
      //success
    } else {
      setErrorMessages(messages);
    }
  };

  const isValidAmount = (amount) => {
    const regex = /^[0-9]+$/; 
    return regex.test(amount);
  };

  const handleKeepFirst = () => {
    const lines = inputValue.split('\n');
    const uniqueLines = [];
    const uniqueAddresses = new Set();
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') continue; 
  
      const [address] = line.split(/[\s,=]+/); 
  
      if (!uniqueAddresses.has(address)) {
        uniqueLines.push(line);
        uniqueAddresses.add(address);
      }
    }
  
    setInputValue(uniqueLines.join('\n'));
    setDuplicates([]); 
    setSelectedOption(null);
  };

const handleCombineBalance = () => {
  const lines = inputValue.split('\n');
  const addressMap = new Map();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue; 
    const [address, amount] = line.split(/[\s,=]+/);

    if (addressMap.has(address)) {
      const duplicateIndexes = addressMap.get(address);
      const newAmount = Number(amount);

      if (!isNaN(newAmount)) {
        for (const duplicateIndex of duplicateIndexes) {
          const currentAmount = Number(
            lines[duplicateIndex].split(/[\s,=]+/)[1]
          );
          if (!isNaN(currentAmount)) {
            const accumulatedAmount = newAmount + currentAmount;
            lines[duplicateIndex] = `${address}=${accumulatedAmount}`;
          }
        }
      }

      lines[i] = ''; 
    } else {
      addressMap.set(address, [i]);
    }
  }

  const resultLines = lines.filter((line) => line !== '');
  const result = resultLines.join('\n');

  setInputValue(result); 
  setDuplicates([]);
  setSelectedOption(null);
};

  const isButtonDisabled = () => {
    return errorMessages.length > 0 || (duplicates.length > 0 && selectedOption === null);
  };

  const consolidatedDuplicateMessage = () => {
    const duplicatesMap = new Map();
  
    duplicates.forEach((duplicate) => {
      if (duplicatesMap.has(duplicate.address)) {
        const existing = duplicatesMap.get(duplicate.address);
        existing.push(duplicate.index1 + 1, duplicate.index2 + 1);
        duplicatesMap.set(duplicate.address, existing);
      } else {
        duplicatesMap.set(duplicate.address, [duplicate.index1 + 1, duplicate.index2 + 1]);
      }
    });
  
    const messages = [];
    duplicatesMap.forEach((indexes, address) => {
      const errorMessage = `${address} duplicate in Line: ${indexes.join(', ')}`;
      messages.push(errorMessage);
    });
  
    return messages.join('\n'); 
  };

  return (
    <div className="App ">
      <div className="disperse bg-gray-800 p-4">
        <div className="header flex justify-between mb-4">
          <div className="left-header text-white">
            Addresses with amounts
          </div>
          <div className="right-header">
            <label htmlFor="file-upload" className=" text-white cursor-pointer">
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
          {duplicates.length > 0 && (<div>
          <span>
          <button
            className="text-red-600 ml-2"
            onClick={() => {
              setSelectedOption('keep');
              duplicates.forEach((duplicate) => {
                handleKeepFirst(duplicate.index1, duplicate.index2, duplicate.address);
              });
            }}
          >
            Keep the first one  |  
          </button>
          <button
            className="text-red-600 ml-2"
            onClick={() => {
              setSelectedOption('combine');
              duplicates.forEach((duplicate) => {
                handleCombineBalance(duplicate.index1, duplicate.index2, duplicate.address);
              });
            }}
          >
            Combine the balance
          </button>
        </span>
          </div>
      
          )}
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
      <p>
        {consolidatedDuplicateMessage()}{' '}

      </p>
    </div>
  </div>
)}

        <div className=" mt-4 right-footer w-full">
          <button
            onClick={handleSubmit}
            className={`text-white ${
              isButtonDisabled() ? 'bg-black' : 'bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800'
            } font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full`}
            disabled={isButtonDisabled()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
