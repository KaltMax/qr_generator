import PropTypes from 'prop-types';

function DynamicInput({ input, onDelete, onChange }) {
  const handleInputChange = (e) => {
    onChange(input.id, e.target.value);
  };

  return (
    <div className="mt-2">
      <label className="block text-m font-bold text-white">
        {input.label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type={input.type}
          name={input.name}
          value={input.value}
          onChange={handleInputChange}
          className="dynamic-input text-white bg-[#111827] mt-1 block w-full px-4 py-2 border border-[#111827] rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          placeholder={`Enter ${input.type} value`} required
          {...(input.type === 'number' ? { step: 'any' } : {})}
        />
        <button
          type="button"
          onClick={() => onDelete(input.id)}
          className="shadow-lg focus:shadow-outline focus:outline-none ml-2 bg-red-800 hover:bg-red-600 text-white py-1 px-2 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

DynamicInput.propTypes = {
  input: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DynamicInput;