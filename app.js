const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const PORT = process.env.PORT || 5000

require('./db/conn');
// const User = require('./db/model/userSchema')
app.use(express.json());

// linking the router files 
app.use(require('./router/auth'));


// const middleware = (req, res, next) => {
//     console.log('hello from middlware');
//     next();
// }

// app.get('/about', middleware, (req, res) => {
//     res.send('hello from about page');
// })

app.get('/contact', (req, res) => {
    res.send('hello from contact page');
})

app.get('/signin', (req, res) => {
    res.send('hello from sign in page')
})

app.get('/signup', (req, res) => {
    res.send('hello from sign up page');
})

app.listen(PORT, () => {
    console.log(` server connected at ${PORT}`);
})