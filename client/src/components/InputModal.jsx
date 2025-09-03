import { useState } from 'react';
import PropTypes from 'prop-types';

function InputModal({ isOpen, onClose, onAddInput }) {
  const [label, setLabel] = useState('');
  const [type, setType] = useState('text');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!label.trim()) return;

    const newInput = {
      id: Date.now(),
      label: label.trim(),
      type,
      name: label.toLowerCase().replace(/\s+/g, '-'),
      value: ''
    };

    onAddInput(newInput);
    
    // Reset form and close modal
    setLabel('');
    setType('text');
    onClose();
  };

  const handleClose = () => {
    setLabel('');
    setType('text');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="shadow-lg fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#374151] rounded-lg p-6 w-full max-w-sm mx-4">
        <h2 className="text-xl font-bold mb-4 text-white text-center">Add New Input</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="input-label" className="block font-bold text-m text-white">
              Label:
            </label>
            <input
              type="text"
              id="input-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="text-white mt-1 block w-full px-4 py-2 border border-[#111827] rounded-md focus:ring-blue-500 focus:border-blue-500 bg-[#111827] focus:outline-none"
              placeholder="Enter Label"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="input-type" className="block text-m font-bold text-white">
              Input Type:
            </label>
            <select
              id="input-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="text-white bg-[#111827] mt-1 block w-full px-4 py-2 border border-[#111827] rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="url">URL</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="shadow-lg focus:shadow-outline focus:outline-none mr-2 bg-red-800 hover:bg-red-600 text-white py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="shadow-lg focus:shadow-outline focus:outline-none bg-green-800 hover:bg-green-600 text-white py-2 px-4 rounded-md"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

InputModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddInput: PropTypes.func.isRequired,
};

export default InputModal;