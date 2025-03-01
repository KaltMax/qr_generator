/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../client/index.html'), 'utf8');

describe('Client-side script tests', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    require('../client/script.js'); // Require the script to attach event listeners
  
    // Mock URL.createObjectURL to return a fake URL stringn
    global.URL.createObjectURL = jest.fn(() => "blob:http://localhost/dummy");
  });
  
  afterEach(() => {
    jest.resetModules();
  });

  test('should add a new input field when the modal form is submitted', () => {
    document.getElementById('input-label').value = 'Test Label';
    document.getElementById('input-type').value = 'text';

    const modalForm = document.getElementById('modal-form');
    const submitEvent = new Event('submit');
    modalForm.dispatchEvent(submitEvent);

    const newInput = document.querySelector('input[name="test-label"]');
    expect(newInput).not.toBeNull();
    expect(newInput.type).toBe('text');
    expect(newInput.placeholder).toBe('Enter text value');
  });

  test('should remove the input field when the delete button is clicked', () => {
    document.getElementById('input-label').value = 'Test Label';
    document.getElementById('input-type').value = 'text';

    const modalForm = document.getElementById('modal-form');
    const submitEvent = new Event('submit');
    modalForm.dispatchEvent(submitEvent);

    const deleteButton = document.querySelector('button.ml-2');
    deleteButton.click();

    const newInput = document.querySelector('input[name="test-label"]');
    expect(newInput).toBeNull();
  });

  test('should display an error message if the form is submitted with empty data', () => {
    const form = document.getElementById('qr-form');
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
  
    // Ensure form and error modal exist
    expect(form).not.toBeNull();
    expect(errorModal).not.toBeNull();
    expect(errorMessage).not.toBeNull();
  
    // Dispatch submit event
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  
    // Check that the error message is displayed
    expect(errorModal.classList.contains('hidden')).toBe(false);
    expect(errorMessage.innerText).toBe('Please add at least one input field.');
  });

  test('should call fetch with correct data and display QR code on success', async () => {
    // 1. Define or mock `fetch` on `global` or `window`
    const fetchMock = jest.fn().mockResolvedValueOnce({
      blob: async () => new Blob([], { type: 'image/png' }),
    });
  
    global.fetch = fetchMock;
  
    // 2. Fill in the form so it's not empty...
    const form = document.getElementById('qr-form');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'username';
    nameInput.value = 'John Doe';
    nameInput.classList.add('dynamic-input');
    form.appendChild(nameInput);
  
    // 3. Dispatch the submit event
    form.dispatchEvent(new Event('submit'));
  
    // 4. Check that `fetch` was called as expected
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/generate-qr'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { username: 'John Doe' } }),
      })
    );
  
    // 5. Await the microtask queue to let .then() run
    await Promise.resolve();
  
    // 6. Assert the QR image was created
    const qrResultDiv = document.getElementById('qr-result');
    const img = qrResultDiv.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.src).toContain("");
  
    // 7. Clean up
    fetchMock.mockRestore();
    delete global.fetch; // or delete window.fetch if you used window
  });

  test('should show modal when "Add Input" button is clicked', () => {
    const addInputButton = document.getElementById('add-input');
    expect(addInputButton).not.toBeNull();
  
    addInputButton.click();
  
    const modal = document.getElementById('input-modal');
    expect(modal.classList.contains('hidden')).toBe(false);
  });

  test('should hide modal when "Close" button is clicked', () => {
    const modal = document.getElementById('input-modal');
    modal.classList.remove('hidden'); // ensure it starts visible
  
    const closeModalButton = document.getElementById('close-modal');
    closeModalButton.click();
  
    expect(modal.classList.contains('hidden')).toBe(true);
  });

  test('should hide modal and reset modal form after adding new input', () => {
    document.getElementById('input-label').value = 'Some Label';
    document.getElementById('input-type').value = 'text';
    const modalForm = document.getElementById('modal-form');
  
    const submitEvent = new Event('submit');
    modalForm.dispatchEvent(submitEvent);
  
    const modal = document.getElementById('input-modal');
    expect(modal.classList.contains('hidden')).toBe(true);
    
    // The label and type should be cleared after reset
    expect(document.getElementById('input-label').value).toBe('');
    expect(document.getElementById('input-type').value).toBe('text');
  });

  test('should set download button attributes correctly when QR code is generated', async () => {
    // Mock fetch response
    const fetchMock = jest.fn().mockResolvedValueOnce({
        blob: async () => new Blob([], { type: 'image/png' }),
    });
    global.fetch = fetchMock;

    // Fill in the form to prevent validation errors
    const form = document.getElementById('qr-form');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'username';
    nameInput.value = 'John Doe';
    nameInput.classList.add('dynamic-input');
    form.appendChild(nameInput);

    // Dispatch form submit event
    form.dispatchEvent(new Event('submit'));

    // Wait for microtask queue to clear
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify that fetch was called
    expect(fetchMock).toHaveBeenCalled();

    // Get the QR image and download button
    const qrImage = document.querySelector('#qr-result img');
    const downloadButton = document.getElementById('download-button');

    // Ensure the image and download button exist
    expect(qrImage).not.toBeNull();
    expect(downloadButton).not.toBeNull();

    // Ensure the download button has the correct attributes
    expect(downloadButton.href).toContain("blob:http://localhost"); // Should be a blob URL
    expect(downloadButton.download).toBe('qrcode.png');
  });

  test('should display error message when QR code generation fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    // Mock fetch to reject (simulate an error)
    const fetchMock = jest.fn().mockRejectedValueOnce(new Error('Network error'));
    global.fetch = fetchMock;
  
    // Fill in the form with a test input
    const form = document.getElementById('qr-form');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'username';
    nameInput.value = 'John Doe';
    nameInput.classList.add('dynamic-input');
    form.appendChild(nameInput);
  
    // Submit the form to trigger fetch request
    form.dispatchEvent(new Event('submit'));
  
    // Wait for microtask queue to clear
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    // Ensure fetch was called
    expect(fetchMock).toHaveBeenCalled();
  
    // Get error modal and message elements
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
  
    // Check if error modal is displayed
    expect(errorModal.classList.contains('hidden')).toBe(false);
  
    // Ensure the correct error message is displayed
    expect(errorMessage.innerText).toBe('An error occurred while generating the QR code.');
  
    // Assert that console.error was called with the expected error
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating QR code:', expect.any(Error));
  
    // Clean up
    consoleErrorSpy.mockRestore();
  });

});
