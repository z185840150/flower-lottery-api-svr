// 游戏表
const mongoose = require('mongoose')

const config = new mongoose.Schema({
  name: { type: String, required: true }, // 游戏名称
  icon: { type: mongoose.Schema.Types.ObjectId, required: true }, // 图标ID
  type: { type: String, required: true, enum: ['sport', 'lottery'] } // 类别
}, { versionKey: false })

module.exports = config
