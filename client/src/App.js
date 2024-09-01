import React, { useState } from 'react';
import { QrReader } from '@blackbox-vision/react-qr-reader';
import axios from 'axios';
import './App.css'; // Ensure this file is created for styling

function App() {
  const [qrData, setQrData] = useState('No result');
  const [showCamera, setShowCamera] = useState(true);

  // Handle the result from the QR reader
  const handleScan = async (result) => {
    if (result) {
      setQrData(result);
      try {
        // Send the QR code data to the backend
        const response = await axios.post('http://localhost:5000/api/qr', { qrCode: result });
        console.log('Backend response:', response.data);
      } catch (error) {
        console.error('Error sending QR code data:', error);
      }
    }
  };

  // Handle any errors from the QR reader
  const handleError = (error) => {
    console.error(error);
  };

  return (
    <div className="App">
      <h1>QR Code Scanner</h1>
      {showCamera && (
        <QrReader
          onResult={(result, error) => {
            if (result) {
              handleScan(result?.text);
            }
            if (error) {
              handleError(error);
            }
          }}
          className="qr-reader"
        />
      )}
      <p>QR Code Data: {qrData}</p>
      {/* Button to toggle camera visibility */}
      <button onClick={() => setShowCamera(!showCamera)}>
        {showCamera ? 'Stop Camera' : 'Start Camera'}
      </button>
    </div>
  );
}

export default App;
