// 用户订单表
const mongoose = require('mongoose')

const userFiles = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, required: true }, // 用户 ID
  type: { type: String, required: true, enum: ['lottery', 'sport'] }, // 竞彩？足彩？
  method: { type: mongoose.Schema.Types.ObjectId, required: true }, // 玩法 ID
  price: { type: Number, required: true }, // 总价格
  num: { type: Number, required: true }, // 数量
  create_time: { type: Date, required: true, default: new Date() }, // 下单时间
  loseefficacy: { type: Boolean, required: true, default: false }, // 失效?
  puy: { // 支付状态
    paid: { type: Boolean, required: true, default: false }, // 已付款
    puytime: { type: Date, default: new Date() }, // 支付时间
    gottime: { type: Date, default: new Date() } // 到账时间
  }
}, { versionKey: false })

module.exports = userFiles
