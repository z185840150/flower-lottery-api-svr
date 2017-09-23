const mongoose = require('mongoose')

const config = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, required: true }, // 用户ID
  u_type: { type: String, required: true, enum: ['admin', 'user'] }, // 用户类别
  time: { type: Date, required: true, default: new Date() }, // 登录时间
  ip: { type: String, required: true }, // IP地址
  ip_address: { type: String, required: true }, // IP归属地
  token: { type: String, required: true } // 授权Token
}, { versionKey: false })

module.exports = config
