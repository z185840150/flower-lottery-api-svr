// 用户文件表
const mongoose = require('mongoose')

const userFiles = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, required: true }, // 用户 ID
  admin: { type: Boolean, required: true, default: false }, // 管理员？
  fid: { type: mongoose.Schema.Types.ObjectId, required: true }, // 文件 ID
  format: { type: String, required: true, default: 'txt', enum: ['jpg', 'png', 'gif', 'svg', 'txt', 'json'] }, // 文件格式
  create_time: { type: Date, required: true, default: new Date() } // 创建时间
}, { versionKey: false })

module.exports = userFiles
