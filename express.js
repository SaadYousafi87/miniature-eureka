const express = require('express');
const path = require('path');
const data = require('./db/db.json');
const fs = require('fs');
const generateUniqueId = require('generate-unique-id');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get('/api/notes', (req, res) => {
    res.json(data);
});

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    if(title && text){
        const newdata = {
            'id': generateUniqueId(),
            title,
            text
        };
        readAndAppend(newdata, './db/db.json');
        const response = {
            status: 'success',
            body: newdata,
        };
        res.json(data);
    }else {
        res.status(500).json('Error in posting note');
    }
});

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}/`);
});