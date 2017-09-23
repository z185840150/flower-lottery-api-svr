const mongoose = require('mongoose')

const admin = new mongoose.Schema({
  username: { type: String, required: true, default: '' },
  salt: { type: String, required: true, default: '' },
  password: { type: String, required: true, default: '' },
  creat_time: { type: String, required: true, default: '' },
  email: { type: String, required: true, default: '' },
  state: { type: String, required: true, default: '' },
  power: { type: String, required: true, default: '' }
}, { versionKey: false })

module.exports = admin
