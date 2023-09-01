const express = require("express");
const ffdb = express.Router();
require('dotenv').config();
const multer = require('multer');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const  ObjectId = require('mongodb').ObjectId;
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const GridFSBucket= require('mongodb').GridFSBucket;

const storage = new GridFsStorage({
  url: `${process.env.MCONNECTION_STRING}`,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'image'
        };
        resolve(fileInfo);
    });
  }
});

const upload = multer({ storage: storage })
const mongoURI = `${process.env.MCONNECTION_STRING}`;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs


conn.once('open', () => {
  let gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('image');
  ffdb.get("/data", (req,res) => {
   const db =  gfs.files.find().toArray();
    db.then((files)=>{
      res.send(files)
    })
  })

});
     var bucket = new GridFSBucket(conn, { bucketName: 'image' });
    ffdb.get("/data/:filename", async (req,res) => {
      const filename = await req.params.filename;
      const stream = await bucket.openDownloadStreamByName(filename);
      stream.on('error', () => {
        res.status(404).send('File not found');
      });
     await stream.on('file',  file => {
        res.set('Content-Type', file.contentType);
        res.attachment(file.filename);
      });
       stream.pipe(await res);
    });

    ffdb.get("/data/innernotes/:id/:name", (req,res) => {
      const ufid = req.params.id;
      const stream = bucket.openDownloadStream(new ObjectId(ufid));
      stream.on('error', () => {
        res.send('File not found');
      });
      stream.on('file', file => {
        res.set('Content-Type', file.contentType);
        res.attachment(file.filename);
      });
      stream.pipe(res);
    });

ffdb.post('/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
      res.json(file);
  })

  ffdb.post('/multipleFiles', upload.array('files'), (req, res, next) => {
    const files = req.files;
    console.log(files);
    if (!files) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send({sttus:  'ok'});
  })

  ffdb.get('/data/delete/:id', async (req, res) => {
     const fileId = req.params.id;
     try{bucket.delete( new ObjectId(fileId)); res.json("File Are Deleted!");}
     catch (err) {res.status(500).json('An error occurred while deleting the file');}
  });

  module.exports = ffdb;