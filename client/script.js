// Get the form and listen for submit event
document.getElementById('qr-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the form data
    const formData = new FormData(document.getElementById('qr-form'));
    const data = {};

    // Save the form data in an object
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Check if the form data is empty
    if (Object.keys(data).length === 0) {
        const errorModal = document.getElementById('error-modal');
        const errorMessage = document.getElementById('error-message'); // Now this is unique
        errorMessage.innerText = 'Please add some input fields.';
        errorModal.classList.remove('hidden');
        return;
    }

    // Get the base URL
    const baseUrl = window.location.origin;

    // Send a POST request with the form data to the server
    fetch(`${baseUrl}/generate-qr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
    })
        // Get the response as a blob and create an image element with the QR code
        .then(response => response.blob())
        .then(blob => {
            const qrResultDiv = document.getElementById('qr-result');
            let qrImage = qrResultDiv.querySelector('img'); // Find existing image

            if (!qrImage) {
                qrImage = document.createElement('img');
                qrResultDiv.appendChild(qrImage); // Only append if it doesn't exist
            }

            qrImage.src = URL.createObjectURL(blob); // Update QR code image

            // Show the success message
            const successMessage = document.getElementById('success-message');
            successMessage.innerText = 'QR-Code generated successfully!';
            successMessage.classList.remove('hidden'); // Make it visible

            // Show the QR code section
            document.getElementById('qr-code').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error generating QR code:', error); // Log the actual error
        
            // Show error modal **only if there's an actual error**
            const errorModal = document.getElementById('error-modal');
            const errorMessage = document.getElementById('error-message');
        
            errorMessage.innerText = 'An error occurred while generating the QR code.';
            errorModal.classList.remove('hidden');
        });
        
});

// Get the add input button and listen for click event
document.getElementById('add-input').addEventListener('click', function () {
    document.getElementById('input-modal').classList.remove('hidden');
});

// Get the close modal button and listen for click event
document.getElementById('close-modal').addEventListener('click', function () {
    document.getElementById('input-modal').classList.add('hidden');
});

// Fix: Remove extra parentheses in `getElementById`
document.getElementById('close-error').addEventListener('click', function () {
    document.getElementById('error-modal').classList.add('hidden');
});

// Get the modal form and listen for submit event
document.getElementById('modal-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the input label and type
    const label = document.getElementById('input-label').value;
    const type = document.getElementById('input-type').value;
    const form = document.getElementById('qr-form');
    const newInputDiv = document.createElement('div');
    newInputDiv.className = 'mt-2';

    // Create a label element and append it to the new input div
    const newLabel = document.createElement('label');
    newLabel.className = 'block text-sm font-bold text-white';
    newLabel.innerText = label;
    newInputDiv.appendChild(newLabel);

    // Create an input container div and append it to the new input div
    const inputContainer = document.createElement('div');
    inputContainer.className = 'flex items-center space-x-2';

    // Create a new input element and append it to the input container div
    const newInput = document.createElement('input');
    newInput.type = type;
    newInput.name = label.toLowerCase().replace(/\s+/g, '-'); // Use label as name
    newInput.className = 'mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500';
    newInput.placeholder = `Enter ${newInput.type} value`;
    newInput.required = true;

    // Add step attribute for number input
    if (type === 'number') {
        newInput.setAttribute('step', 'any');
    }

    // Append the new input to the input container div
    inputContainer.appendChild(newInput);

    // Create a delete button and append it to the input container div
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'ml-2 bg-red-800 hover:bg-red-600 text-white py-1 px-2 rounded-md';
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', function () {
        form.removeChild(newInputDiv);
        document.getElementById('qr-code').classList.add('hidden');
        document.getElementById('qr-result').innerHTML = '';
        document.getElementById('success-message').classList.add('hidden');
        document.getElementById('error-message').classList.add('hidden');
    });

    // Append the delete button to the input container div
    inputContainer.appendChild(deleteButton);
    newInputDiv.appendChild(inputContainer);

    // Insert the new input div before the last element in the form
    form.insertBefore(newInputDiv, form.querySelector('.mt-4'));

    // Close the modal and reset the form
    document.getElementById('input-modal').classList.add('hidden');
    document.getElementById('modal-form').reset();
});
