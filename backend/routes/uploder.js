const express = require("express");
const inmanager = express.Router();
require('dotenv').config();
const multer = require('multer');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const { json } = require("body-parser");
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const GridFSBucket = require('mongodb').GridFSBucket;
var ObjectId = require('mongodb').ObjectId;

const storage = new GridFsStorage({
  url: `${process.env.MCONNECTION_STRING}`,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: 'uploader'
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

var bucket = new GridFSBucket(conn, { bucketName: 'uploader' });
conn.once('open', () => {
  let gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploader');
  
  inmanager.get("/Files", (req, res) => {
    const db = gfs.files.find().toArray();
    db.then((files) => {
      res.send(files)
      console.log(files)
    })
  })
  inmanager.get("/Files/:filename", async (req, res) => {
    const fileId = req.params.filename;
    const id = new ObjectId(fileId)
   const file = await bucket.find({_id:id}).toArray()
   const finded = file[0];
  //  if (finded) {
  //    return res.status(404).send('File not found');
  //  }
   const downloadStream = bucket.openDownloadStream(finded._id);
   const chunks = [];
   downloadStream.on('data', (chunk) => {
     chunks.push(chunk);
   });

   downloadStream.on('end', () => {
     const fileBuffer = Buffer.concat(chunks);
     const fileUrl = `data:${finded.contentType};base64,${fileBuffer.toString('base64')}`;
     res.json(fileUrl);
    //  return res.send(`<a href="${fileUrl}">${fileUrl}</a>`);
   });

    
  });
});
//****************************just view**************** */
inmanager.get("/Searchable/:filename", (req,res) => {
  const filename = req.params.filename
  const stream = bucket.openDownloadStreamByName(filename);
  stream.on('error', () => {
    res.status(404).send('File not found');
  });
  stream.on('file', file => {
    res.set('Content-Type', file.contentType);
    res.attachment(file.filename); 
  });
  stream.pipe(res);
});

// //http://localhost:4000/api/Searchable/Ashishpatel_resume.docx


const reconurl = `${process.env.MMONGO_URL}`;
const client = new MongoClient(reconurl, { useNewUrlParser: true });
client.connect();

//upload.single('file'),
inmanager.post('/slfiles', upload.single('file'), async (req, res) => {
  var file = await req.file;
  var objectData = await JSON.parse(req.body?.objectData);
  var dbc = client.db('Info-saverDB');
  var uuid = await objectData.uid;
  if (objectData.datas) {
    const dbfid = await objectData.datas._id;
    const dsdat = await dbc.collection(`Folder/${uuid}`).findOneAndUpdate({ _id: new ObjectId(dbfid) }, {
      $push: {
        files: {
          fsidf: file.id,
          name: file.originalname,
          filesize: file.size,
          mimetype: file.mimetype,
          uuidf: uuid
        }
      }
    });
    const pipeline = [
      { $match: { "files.fsidf": file.id } },
      { $unwind: "$files" },
      { $match: { "files.fsidf": file.id } },
      { $replaceRoot: { newRoot: "$files" } }
    ];
    const updfinder = await dbc.collection(`Folder/${uuid}`).aggregate(pipeline).toArray();
    if (dsdat) {
      file = '';
      objectData = '';
      uuid = '';
    }else('')
    return res.json(updfinder);
  } 
  else {
    const direct = {
      property: true,
      fsidf: file.id,
      name: file.originalname,
      filesize: file.size,
      mimetype: file.mimetype,
      uuidf: uuid
    }
    const redidata = await dbc.collection(`Folder/${uuid}`).insertOne(direct);
    const insertedDocument = await dbc.collection(`Folder/${uuid}`).findOne({ _id: new ObjectId(redidata.insertedId) });
    if (redidata) {
      file = '';
      objectData = '';
      uuid = '';
    }else{''}
    return res.json(insertedDocument);
   }
})


// Created gfiles

// inmanager.post('/G-files', upload.single('file'), async (req, res, next) => {
//   var file = await req.file;
//   console.log(file);
//   var objectData = await JSON.parse(req.body?.objectData);
//   var dbc = client.db('Info-saverDB');
//   var uuid = await objectData.uid;
//   if (objectData.datas) {
//     const dbfid = await objectData.datas._id;
//     const dsdat = await dbc.collection(`Folder/${uuid}`).findOneAndUpdate({ _id: new ObjectId(dbfid) }, {
//       $push: {
//         files: {
//           fsidf: file.id,
//           name: file.originalname,
//           filesize: file.size,
//           mimetype: file.mimetype,
//           uuidf: uuid
//         }
//       }
//     });
//     if (!file) {
//       res.send("File not selected")
//     }
//     await res.json(file);
//     if (dsdat) {
//       file = '';
//       objectData = '';
//       uuid = '';
//     }
//   } else {
//     const direct = {
//       property: true,
//       fsidf: file.id,
//       name: file.originalname,
//       filesize: file.size,
//       mimetype: file.mimetype,
//       uuidf: uuid
//     }
//     const redidata = await dbc.collection(`Folder/${uuid}`).insertOne(direct);
//     console.log(redidata)
//     if (!file) {
//       res.send("File not selected")
//     }
//     await res.json(file)
//     if (redidata) {
//       file = '';
//       objectData = '';
//       uuid = '';
//     }
//   }
// })

inmanager.post('/multipleFilesmn', upload.array('files'), (req, res, next) => {
  const files = req.files;
  console.log(files);
  if (!files) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send({ sttus: 'ok' });
})

inmanager.post('/Files/delete', async (req, res) => {
  var slfileId = await req.body.param1;
  const param2 = await JSON.stringify(req.body.param2);
  const ffgf = await req.body.param3
 
  if (ffgf !== undefined) {
    var param3 = JSON.stringify(req.body.param3);
    var slDoc = await JSON.parse(param3)
  } else { console.log("array malelnathi") }

  try {
    var file = await JSON.parse(param2)
    var dbc = client.db('Info-saverDB');
    if (!slDoc) {
      console.log("selected doc 6e");
      const fried = await dbc.collection(`Folder/${file.uuidf}`).findOne({ _id: new ObjectId(file._id) });
      console.log(fried);
      const dsdat = await dbc.collection(`Folder/${file.uuidf}`).findOneAndDelete({ _id: new ObjectId(file._id) })
       bucket.delete(new ObjectId(slfileId)); 
      slfileId = "";
      file = "";
      return res.json(fried);
     } 
     else {
      const query = {
        _id: new ObjectId(slDoc._id)
      };
      var usdf = new ObjectId(file.fsidf);
      
      const pipeline = [
        { $match: { "files.fsidf": usdf } },
        { $unwind: "$files" },
        { $match: { "files.fsidf": usdf } },
        { $replaceRoot: { newRoot: "$files" } }
      ];
      const updfinder = await dbc.collection(`Folder/${file.uuidf}`).aggregate(pipeline).toArray();
      const ffdfg = await dbc.collection(`Folder/${file.uuidf}`).updateOne(query, { $pull: { files: { fsidf: usdf } } });
      if (ffdfg) {
      const adltd = bucket.delete(new ObjectId(usdf));
        slDoc = '';
        usdf = '';
       return res.json(updfinder);
      }
    }
   } catch (err) {
    console.log(err)
   return res.send("somthing wrong!")
  }


});

module.exports = inmanager;