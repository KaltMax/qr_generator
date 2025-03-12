const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const router = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(router);

if (require.main === module) {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server listening on port: ${port}`);
    });
}

module.exports = app;
