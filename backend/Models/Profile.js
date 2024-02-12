const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MyFileSchema = new Schema({
  filename: { type: String },
  contentType: { type: String },
  length: { type: Number },
  uploadDate: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed },
  data: { type: Buffer }
})

module.exports = mongoose.model('Profiles', MyFileSchema);