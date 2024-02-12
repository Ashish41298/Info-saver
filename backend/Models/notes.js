const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define collection and schema
let Notes = new Schema({
   date: { type: String },
   title: { type: String },
   discription: { type: String },
   important: { type: Number },
   color: { type: String },
   imgurl: { type: String },
   imageID: { type: String },
   innerimage: { type: String },
   audioID: { type: String },
   audio: { type: String }
}, {
   collection: 'notes'
})
module.exports = mongoose.model('notes', Notes)