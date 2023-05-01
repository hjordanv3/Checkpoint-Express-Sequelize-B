const express = require('express');
const app = express();
const morgan = require('morgan');
module.exports = app; 
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/index'));

app.get('/', function (req, res) {
  res.redirect('/');
})

app.use((err, req, res, next) => {
  res.sendStatus(err.status);
});

if (!module.parent) app.listen(3000); 
