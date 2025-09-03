const http = require('http');
const app = require('../server/app');

describe('App Tests', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4000);
  });

  afterAll(() => {
    server.close();
  });

  const makePostRequest = (path, data) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 4000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const req = http.request(options, (res) => {
        let data = [];
        res.on('data', (chunk) => {
          data.push(chunk);
        });
        res.on('end', () => {
          res.body = Buffer.concat(data);
          resolve(res);
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(JSON.stringify(data));
      req.end();
    });
  };

  const makeGetRequest = (path) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 4000,
        path,
        method: 'GET',
      };

      const req = http.request(options, (res) => {
        let data = [];
        res.on('data', (chunk) => {
          data.push(chunk);
        });
        res.on('end', () => {
          res.body = Buffer.concat(data);
          resolve(res);
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.end();
    });
  };

  test('should use bodyParser.json middleware', async () => {
    const response = await makePostRequest('/generate-qr', { data: { id: '123', price: '9.99' } });
    expect(response.statusCode).not.toBe(415); // Ensure the request is not rejected due to unsupported media type
  });

  test('should use CORS middleware', async () => {
    const response = await makeGetRequest('/generate-qr');
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  test('POST /generate-qr should return a PNG image', async () => {
    const mockData = { id: '123', price: '9.99' };
    const response = await makePostRequest('/generate-qr', { data: mockData });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('image/png');
  });

  test('POST /generate-qr with invalid data should return 400', async () => {
    const mockData = { id: '', price: '' }; // Invalid data
    const response = await makePostRequest('/generate-qr', { data: mockData });

    expect(response.statusCode).toBe(400);
  });

  test('POST /generate-qr with different input types should return 200', async () => {
    const mockData = { id: '123', price: '9.99', url: 'http://example.com', email: 'test@example.com' };
    const response = await makePostRequest('/generate-qr', { data: mockData });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('image/png');
  });
  
});
