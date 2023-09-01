const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// Define collection and schema

const File = new Schema({
  fileName: { type: String },
  fileSize: { type: Number },
});

const Folder = new Schema({
  name: {
    type: String,
    required: true
  },
  parentFolder: {
    type: String
  },
  files: [File]
});

module.exports = mongoose.model('Folder', Folder);
