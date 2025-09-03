const QRCode = require('qrcode');

exports.formatData = (data) => {
    let qrCodeText = '';
    for (const [key, value] of Object.entries(data)) {
        qrCodeText += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}, `;
    }
    qrCodeText = qrCodeText.slice(0, -2);
    return qrCodeText;
};

exports.generateQRCode = async (qrCodeText) => {
    const options = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1
    };

    const qrCodeBuffer = await QRCode.toBuffer(qrCodeText, options);
    return qrCodeBuffer;
};