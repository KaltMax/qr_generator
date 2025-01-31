const controller = require('../server/controller');
const service = require('../server/service');

jest.mock('../server/service'); // Mock service to isolate controller behavior

describe('Controller Tests', () => {
  test('generateQR should send a QR code as a PNG', async () => {
    const req = {
      body: {
        data: { id: '123', price: '9.99' },
      },
    };
    const res = {
      setHeader: jest.fn(),
      type: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const qrCodeBuffer = Buffer.from('dummy-png-data');
    service.formatData.mockReturnValue('Product ID: 123, Price: $9.99');
    service.generateQRCode.mockResolvedValue(qrCodeBuffer);

    await controller.generateQR(req, res);

    expect(service.formatData).toHaveBeenCalledWith({ id: '123', price: '9.99' });
    expect(service.generateQRCode).toHaveBeenCalledWith('Product ID: 123, Price: $9.99');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=qrcode.png');
    expect(res.type).toHaveBeenCalledWith('image/png');
    expect(res.send).toHaveBeenCalledWith(qrCodeBuffer);
  });

  test('generateQR should return 500 on error', async () => {
    const req = {
      body: { data: { id: '123', price: '9.99' } },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Mock the service function to throw an error
    service.formatData.mockImplementation(() => {
      throw new Error('Test error');
    });

    await controller.generateQR(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
  
});
