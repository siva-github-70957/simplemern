const mongoose = require('mongoose');
const DB = process.env.DATABASE

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, }).
    then(() => console.log('connection succesfull'))
    .catch((e) => console.log('db connection error', e));