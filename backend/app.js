const express = require('express');
const app = express();

if(process.env.NODE_ENV != 'Production'){
    require('dotenv').config({path: 'backend/config/config.env'})
}

//using Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Importing Routes
const post = require('./routes/post');
const user = require('./routes/user');

//using Routes
app.use('/api/v1', post);
app.use('/api/v1', user);


module.exports = app;