const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const router = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '..', 'client')));

// Use routes
app.use(router);

// Start the server
if (require.main === module) { // Ensure the app listens only when run directly
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server listening on port: ${port}`);
    });
}

// Export the app for testing
module.exports = app;
