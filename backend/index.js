const express = require('express');
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
// Connecting with mongo db
const createError = require('http-errors');
const connectionM_String = process.env.MCONNECTION_STRING;
mongoose
  .connect(`${connectionM_String}`)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  })
  
// Setting up port with express js
 const userRoute = require('./routes/User.route');
const NotesRoute = require('./routes/Notes.route');
const ffdb = require('../backend/routes/Profileimg');
const file = require('../backend/routes/filemanager');
const inmanager = require('../backend/routes/uploder');
const app = express()
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(cors({ origin: "*" }));
// app.use(express.static(path.join(__dirname, 'dist/Info-saver')))
// app.use('/', express.static(path.join(__dirname, 'dist/Info-saver')))
app.use('/api',  NotesRoute); //userRoute ||
app.use('/api',  userRoute); 
app.use('/api',  ffdb); 
app.use('/api', file);
app.use('/api', inmanager);
// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})
// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404))
})
// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
})



