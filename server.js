const express = require('express');
var app = express();
//app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());
app.options('*', cors());
app.use(express.json());
var corsOptions = {
  origin: "http://localhost:3000"
};

const port = process.env.PORT || 5000;
app.post('/send-trace', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  // TODO: send trace data to Honeycomb
  const fs = require('fs')
  //console.log(req.headers);
  console.log(req.body);
// append data to a file
  fs.appendFile('file.txt', JSON.stringify(req.body)+'\n', err => {
    if (err) {
      console.log('File is error.')
    }
    console.log('File is updated.')
  });
  res.send({ status: 'done' });
});
app.listen(port, () => console.log(`Listening on port ${port}`));