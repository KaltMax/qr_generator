const service = require('./service');

exports.generateQR = async (req, res) => {
    try {
        const { data } = req.body;

        if (!data || Object.values(data).some(value => !value.trim())) {
            return res.status(400).send({ error: 'Invalid data. All fields must be filled.' });
        }

        const qrCodeText = service.formatData(data);
        const qrCodeBuffer = await service.generateQRCode(qrCodeText);

        res.setHeader('Content-Disposition', 'attachment; filename=qrcode.png');
        res.type('image/png').send(qrCodeBuffer);
    } catch {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};