// Get the form and listen for submit event
document.getElementById('qr-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Select only the dynamic inputs added via the modal
    const dynamicInputs = document.querySelectorAll('#qr-form input.dynamic-input');

    // Check if there are any dynamic inputs
    if (dynamicInputs.length === 0) {
        const errorModal = document.getElementById('error-modal');
        const errorMessage = document.getElementById('error-message');
        errorMessage.innerText = 'Please add at least one input field.';
        // Remove any hidden class from the error message element
        errorMessage.classList.remove('hidden');
        errorModal.classList.remove('hidden');
        return;
    }

    // Build a data object only from the dynamic inputs
    const data = {};
    dynamicInputs.forEach(input => {
        data[input.name] = input.value;
    });

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
        // Timeout to hide the success message after 3 seconds
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 3000);

        // Show the QR code section
        document.getElementById('qr-code').classList.remove('hidden');

        // Set up the download button
        const downloadButton = document.getElementById('download-button');
        downloadButton.classList.remove('hidden');
        downloadButton.href = qrImage.src;
        downloadButton.download = 'qrcode.png';

        // Add click event to handle download success and errors
        downloadButton.addEventListener('click', function () {
            try {
                // Attempt to trigger the download
                const downloadMessage = document.getElementById('download-message');
                downloadMessage.innerText = 'QR-Code downloaded successfully!';
                downloadMessage.classList.remove('hidden');
                setTimeout(() => {
                    downloadMessage.classList.add('hidden');
                }, 3000);
            } catch (error) {
                console.error('Error downloading QR code:', error);

                // Show error modal when download fails
                const errorModal = document.getElementById('error-modal');
                const errorMessage = document.getElementById('error-message');
                errorMessage.innerText = 'An error occurred while downloading the QR code.';
                errorMessage.classList.remove('hidden');
                errorModal.classList.remove('hidden');
            }
        });
    })
    .catch(error => {
    console.error('Error generating QR code:', error);

    // Show error modal only if there's an actual error in generation
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerText = 'An error occurred while generating the QR code.';
    errorMessage.classList.remove('hidden');
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

// Remove extra parentheses fix: listen for click on the error close button
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
    newLabel.className = 'block text-m font-bold text-white';
    newLabel.innerText = label;
    newInputDiv.appendChild(newLabel);

    // Create an input container div and append it to the new input div
    const inputContainer = document.createElement('div');
    inputContainer.className = 'flex items-center space-x-2';

    // Create a new input element, add the dynamic-input class, and append it to the input container div
    const newInput = document.createElement('input');
    newInput.type = type;
    newInput.name = label.toLowerCase().replace(/\s+/g, '-'); // Use label as name
    newInput.className = 'dynamic-input text-white bg-[#111827] mt-1 block w-full px-4 py-2 border border-[#111827] rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none';
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
    deleteButton.className = 'shadow-lg focus:shadow-outline focus:outline-none ml-2 bg-red-800 hover:bg-red-600 text-white py-1 px-2 rounded-md';
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', function () {
        // Remove the entire newInputDiv from the form
        form.removeChild(newInputDiv);
    });

    // Append the delete button to the input container div
    inputContainer.appendChild(deleteButton);
    newInputDiv.appendChild(inputContainer);

    // Insert the new input div before the element with class ".mt-4" in the form
    form.insertBefore(newInputDiv, form.querySelector('.mt-4'));

    // Close the modal and reset the modal form
    document.getElementById('input-modal').classList.add('hidden');
    document.getElementById('modal-form').reset();
});
