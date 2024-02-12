const express = require('express');
const app = express();
const NotesRoute = express.Router();
let notes = require('../Models/notes');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');
NotesRoute.post('/notes', (req, res) => {
    const Notes = new notes(req.body);
    Notes.save()
      .then(() => {
        res.json(Notes);
      })
      .catch(err => res.status(400).json(err));
  });

  NotesRoute.get('/notes', (req, res) => {
    notes.find()
      .then(notes => res.json(notes))
      .catch(err => res.status(400).json(err));
  });
  
  // Get a user by id
  NotesRoute.get('/notes/imp', (req, res) => {
    notes.find({"important":1})
    .then(notes => res.json(notes))
    .catch(err => res.status(400).json(err));

    // notes.findById(req.params.id)
    //   .then(notes => res.json(notes))
    //   .catch(err => res.status(400).json(err));
  });
  
  // Update a user by id
  NotesRoute.put('/notes/:id', (req, res) => {
    notes.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(notes => res.json(notes))
      .catch(err => res.status(400).json(err));
  });
  
  // Delete a user by id
  NotesRoute.delete('/notes/:id', async (req, res) => {
      const id = req.params.id;
     await notes.findByIdAndDelete(id).then((ref)=>{
        res.send(ref)
      });
  });


module.exports = NotesRoute;