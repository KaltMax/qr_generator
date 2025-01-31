const service = require('../server/service');

describe('Service Tests', () => {
  test('formatData should format data correctly', () => {
    const data = { id: '123', price: '9.99', url: 'http://example.com', email: 'example@mail.com' };
    const result = service.formatData(data);
    expect(result).toBe('Id: 123, Price: 9.99, Url: http://example.com, Email: example@mail.com');
  });

  test('generateQRCode should return a valid buffer', async () => {
    const qrCodeText = 'Sample QR Code';
    const buffer = await service.generateQRCode(qrCodeText);
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
  });
  
});
