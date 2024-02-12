const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define collection and schema
let Users = new Schema({
   _id: {
      type: String,
   },
   email: {
      type: String,
      unique:true
   },
   name: {
      type: String,
      unique:true
   },
   photoUrl: {
      type: String
   },
   idToken: {
      type: String
   },
   fileID: {
      type: String
   }
}, {
   collection: 'users'
})
module.exports = mongoose.model('users', Users)