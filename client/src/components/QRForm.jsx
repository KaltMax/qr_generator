import { useState } from 'react';
import DynamicInput from './DynamicInput';
import InputModal from './InputModal';
import QRResult from './QRResult';
import { toast } from 'react-toastify';

function QRForm() {
  const [inputs, setInputs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [showQRResult, setShowQRResult] = useState(false);

  const handleAddInput = (newInput) => {
    setInputs(prev => [...prev, newInput]);
  };

  const handleDeleteInput = (inputId) => {
    setInputs(prev => prev.filter(input => input.id !== inputId));
  };

  const handleInputChange = (inputId, value) => {
    setInputs(prev => 
      prev.map(input => 
        input.id === inputId ? { ...input, value } : input
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputs.length === 0) {
      toast.error('Please add at least one input field.');
      return;
    }

    const data = {};
    inputs.forEach(input => {
      data[input.name] = input.value;
    });

    try {
      const baseUrl = window.location.origin;

      const response = await fetch(`${baseUrl}/generate-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      setQrImageUrl(imageUrl);
      setShowQRResult(true);
      toast.success('QR-Code successfully generated!');
      
    } catch (error) {
      toast.error('An error occurred while generating the QR code.');
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-4">
      {/* Form Box */}
      <div className="bg-[#374151] shadow-lg rounded-lg p-6 w-full">
        <h1 className="text-2xl font-bold text-center mb-4 text-white">QR-Code Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dynamic Inputs */}
          {inputs.map(input => (
            <DynamicInput
              key={input.id}
              input={input}
              onDelete={handleDeleteInput}
              onChange={handleInputChange}
            />
          ))}
          
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="shadow-lg w-full bg-blue-800 hover:bg-blue-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-md"
            >
              Add Input
            </button>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full shadow-lg bg-purple-800 hover:bg-purple-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-md"
            >
              Generate QR Code
            </button>
          </div>
        </form>
      </div>

      {/* QR Code Result */}
      <QRResult 
        qrImageUrl={qrImageUrl}
        isVisible={showQRResult}
      />

      {/* Input Modal */}
      <InputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddInput={handleAddInput}
      />
    </div>
  );
}

export default QRForm;