const QRCode = require('qrcode');

// Format the data to be displayed in the QR code
exports.formatData = (data) => {
    let qrCodeText = '';
    for (const [key, value] of Object.entries(data)) {
        qrCodeText += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}, `;
    }
    qrCodeText = qrCodeText.slice(0, -2); // Remove the trailing comma and space
    return qrCodeText;
};

// Generate the QR code
exports.generateQRCode = async (qrCodeText) => {
    const options = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1
    };

    const qrCodeBuffer = await QRCode.toBuffer(qrCodeText, options);
    return qrCodeBuffer;
};
