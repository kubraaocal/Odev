const express = require('express');
const app = express();
const api=require('./api/routers/api');
const cors = require('cors')

app.use(cors({
    origin: '*',
}));

app.use('/api',api);

module.exports = app;

