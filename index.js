const csv = require('csv');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const upload = multer(); // for parsing multipart/form-data
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

// simple async wrapper for express
const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// asyncable parser for the example file
const parseCsv = (text) => new Promise((resolve, reject) => {
  csv.parse(text, (err, result) => {
    if (err) {
      return reject(err);
    }
    const keys = result[0]; // in the example.csv the first row contains column headers
    result.shift();
    resolve(result.map(cells => {
      const item = {};
      keys.forEach((key, i) => { item[key.toLowerCase()] = cells[i]; });
      return item;
    }));
  });
});

// ----

app.post('/upload-filereader', asyncMiddleware(async (req, res) => {
  console.info('filereader upload POST', req.body);
  result = await parseCsv(req.body.csv);
  res.json(result);
}));

app.post('/upload-formdata', upload.single('file'), asyncMiddleware(async (req, res) => {
  // req.body holds some metadata (see data.append in the client)
  // req.file is metadata and the raw buffer
  console.info('formdata upload POST', req.body, req.file);
  result = await parseCsv(req.file.buffer.toString());
  res.json(result);
}));

// ----

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
