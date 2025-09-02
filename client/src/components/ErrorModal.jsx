import PropTypes from 'prop-types';

function ErrorModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="shadow-lg fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#374151] rounded-lg p-6 w-full max-w-sm mx-4">
        <h2 className="text-xl font-bold mb-4 text-red-500 text-center">Error</h2>
        <p className="text-white font-bold text-center mb-4">{message}</p>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="shadow-lg focus:shadow-outline focus:outline-none mt-4 bg-red-800 hover:bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

ErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default ErrorModal;