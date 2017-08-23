var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
//var User = require('./app/models/user');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();//for passing multiport /form-data
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
//var ngRightClick =require('angular-right-click')
app.use(morgan('dev'));
app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);


mongoose.connect('mongodb://localhost:27017/userdb', function (err) {
    if (err) {
        console.log('Not connected to the database: ' + err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
});



// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/uploads/images/');
//     },
//     filename: function (req, file, cb) {
//         if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
//             var err = new Error();
//             err.code = 'filetype';
//             return cb(err);
//         } else {
//             // cb(null, Date.now() + '_' + file.originalname);
//             cb(null,  file.originalname);
//         }

//     }
// });
// var upload = multer({
//     storage: storage,
//     //limits: {fileSize:'100000000' }
// }).single('myfile');//should match the name in input type in html 

// app.post('/upload', function (req, res) {
//     upload(req, res, function (err) {
//         if (err) {
//             if (err.code === 'filetype') {
//                 res.json({ success: false, message: 'File type is invalid. Must be jpeg/pg/png type only' });
//             } else {
//                 res.json({ success: false, message: 'File was not able to be uploaded' });
//             }
//         } else {
//             res.json({ success: true, message: 'File was uploaded' });
//         }

//     });
// });

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})



app.listen(port, function () {
    console.log('Running the server ' + port);
});