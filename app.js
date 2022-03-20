const express = require('express');
const app = express();

const api=require('./api/routers/api');


app.use('/api',api);

module.exports = app;

