const express = require('express');
const path = require('path');
const data = require('./db/db.json');

const app = express();
const port = 3001;

app.use(express.static('public'));



app.listen(port, () => {
    console.log(`App is listening at http://localhost:${PORT}/`);
});