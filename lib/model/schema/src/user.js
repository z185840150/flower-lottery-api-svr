const mongoose = require('mongoose')

const user = new mongoose.Schema({
  username: { type: String, required: true, default: '', unique: true },
  nickname: { type: String, required: true, default: '' },
  salt: { type: String, required: true, default: '' },
  password: { type: String, required: true, default: '' },
  sex: { type: String, default: '' },
  bind: {
    wx: {
      openid: { type: String, default: '' }
    },
    phone: {
      code: { type: String, default: '' }
    },
    email: { type: String, required: true, default: '' }
  },
  create_time: { type: String, required: true, default: '' },
  state: { type: String, required: true, default: '' },
  parent: { type: mongoose.Schema.Types.ObjectId }
}, { versionKey: false })

module.exports = user
