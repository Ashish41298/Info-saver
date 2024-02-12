const express = require('express');
const app = express();
const Files = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();
var ObjectId = require('mongodb').ObjectId;

const { MongoClient } = require('mongodb');
const Mdbs_url = process.env.MMONGO_URL
const mongoURI = `${Mdbs_url}`;
const client = new MongoClient(mongoURI, { useNewUrlParser: true });
client.connect();

Files.post('/Files', async (req, res) => {
    const data = await req.body;
 const uid = data[0].userID;
  const file = data[1];
 var dbc = client.db('Info-saverDB');
 const existingData = await dbc.collection(`Folder/${uid}`).findOne({ name: file.name });
 if(existingData){
return res.json('Name already exists');
 }else{
  dbc.collection(`Folder/${uid}`).insertOne({
    _id:file._id,
    name:file.name,
    parentFolder:file.parentFolder,
    files:file.files
 }).then(async ind=>{
  const findes = await dbc.collection(`Folder/${uid}`).find({ _id: ind.insertedId}).toArray();
  if(findes){res.send(findes)}
 }).catch(error => {res.send(error)})
 }
 });

 

Files.get("/Folder:id", async (req, res) => {
  try {
    const uid = req.params.id;
    var dbc = client.db('Info-saverDB');
    const asd = await dbc.collection(`Folder/${uid}`).find().toArray();
    const data = asd
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = Files;