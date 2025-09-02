import PropTypes from 'prop-types';

import { useState } from 'react';

function QRResult({ qrImageUrl, isVisible }) {
  const [successMessage, setSuccessMessage] = useState('');
  const [downloadMessage, setDownloadMessage] = useState('');

  const handleDownload = () => {
    try {
      setDownloadMessage('QR-Code downloaded successfully!');
      setTimeout(() => {
        setDownloadMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      // Error handling would be passed up to parent component
    }
  };

  const showSuccessMessage = () => {
    setSuccessMessage('QR-Code generated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Expose function to parent component via useEffect
  if (qrImageUrl && !successMessage) {
    showSuccessMessage();
  }

  if (!isVisible) return null;

  return (
    <div className="mt-2 bg-[#374151] shadow-lg rounded-lg p-6 w-full">
      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 bg-green-800 text-white font-bold text-center py-2 px-4 rounded-md">
          {successMessage}
        </div>
      )}
      
      {/* Download Message */}
      {downloadMessage && (
        <div className="mt-4 bg-green-800 text-white font-bold text-center py-2 px-4 rounded-md">
          {downloadMessage}
        </div>
      )}
      
      {/* QR Code */}
      <div className="mt-4 flex justify-center">
        {qrImageUrl && (
          <img 
            src={qrImageUrl} 
            alt="Generated QR Code" 
            className="max-w-full h-auto" 
          />
        )}
      </div>
      
      {/* Download Button */}
      <div className="mt-4">
        {qrImageUrl && (
          <a
            href={qrImageUrl}
            download="qrcode.png"
            onClick={handleDownload}
            className="block w-full shadow-lg bg-blue-800 hover:bg-blue-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-md text-center"
          >
            Download QR Code
          </a>
        )}
      </div>
    </div>
  );
}

QRResult.propTypes = {
  qrImageUrl: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default QRResult;