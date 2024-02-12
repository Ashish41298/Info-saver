const express = require('express');
const userRoute = express.Router();
// Employee model
let Users = require('../Models/User');
//for users
  // Create a new user
  userRoute.post('/users', async (req, res) => {
    const user = new Users(req.body);
    const email = req.body.email;
    const userExist = await Users.findOne({ email: email });
    if(!userExist){
      user.save()
      .then(() => {
        res.json(user);
      })
    }else{ return res.json({ error: "Email already exists" });}
  });
  
  // Get all users
  userRoute.get('/users', (req, res) => {
    Users.find()
      .then(users => res.json(users))
      .catch(err => res.status(400).json(err));
  });
  
  // Get a user by id
  userRoute.get('/users/:id', (req, res) => {
    Users.findById(req.params.id)
      .then(user => res.json(user))
      .catch(err => res.status(400).json(err));
  });
  
  // Update a user by id
  userRoute.put('/users/:id', (req, res) => {
    Users.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(user => res.json(user))
      .catch(err => res.status(400).json(err));
  });
  
  // Delete a user by id
  userRoute.delete('/users/:id', (req, res) => {
    Users.findByIdAndDelete(req.params.id)
      .then((getrd) => {
        res.json(getrd);
      })
      .catch(err => res.status(400).json(err));
  });
  
module.exports = userRoute;