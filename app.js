const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const restaurantesRoutes = require ('./api/routes/restaurantes');
const usersRoutes = require ('./api/routes/users');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/users',usersRoutes);
app.use('/restaurantes',restaurantesRoutes);

mongoose.connect('mongodb://localhost/restaurantes')

app.use((req,res,next)=>{
    const error = new Error('not found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message: error.message
        }
    });    
});

module.exports = app;