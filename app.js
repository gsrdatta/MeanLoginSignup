const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var http = require('http');

mongoose.promise = global.Promise;
const app = express();

//Configure app
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Cache-Control, Connection,Authorization');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    next();
})

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


//Configure Mongoose
mongoose.connect("mongodb://localhost:27017/amtica", { useNewUrlParser: true });
mongoose.set('debug', true);

require('./models/Users');

app.use(require('./routes'));

http.createServer(app).listen(4000);
console.log('Server running on http://localhost:4000');
