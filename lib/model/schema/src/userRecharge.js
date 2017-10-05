// 用户充值记录
const mongoose = require('mongoose')

const userFiles = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, required: true }, // 用户 ID
  money: { type: Number, required: true }, // 金额
  admin: { type: Boolean, required: true, default: false }, // 管理员充值?
  aid: { type: mongoose.Schema.Types.ObjectId }, // 管理员 ID
  way: { type: mongoose.Schema.Types.ObjectId } // 充值渠道
}, { versionKey: false })

module.exports = userFiles
