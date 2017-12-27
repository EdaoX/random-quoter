const path = require('path');
const express = require('express');
const helmet = require('helmet');
require('express-async-errors');
const config = require('./config/config');

// Middleware
const bodyParser = require('body-parser');
const urlCompose = require('./middleware/urlCompose');

// Routes
const webhook = require('./routes/webhook');
const quotes = require('./routes/quotes');
const api = require('./routes/api');

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));
app.use(express.static('public'));

app.use(urlCompose);

app.set('view engine', 'pug');

app.use('/api', api);
app.use('/webhook', webhook);
app.use('/quotes', quotes);

app.listen( config.PORT , function () {
  console.log(`Example app listening on port ${config.PORT}!`);
});
