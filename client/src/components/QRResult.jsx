import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

function QRResult({ qrImageUrl, isVisible }) {
  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = qrImageUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR-Code successfully downloaded!');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('An error occurred while downloading the QR code.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="mt-2 bg-[#374151] shadow-lg rounded-lg p-6 w-full">
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
          <button
            onClick={handleDownload}
            className="block w-full shadow-lg bg-blue-800 hover:bg-blue-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-md text-center"
          >
            Download QR Code
          </button>
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