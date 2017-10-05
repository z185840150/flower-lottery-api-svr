// 玩法表
const mongoose = require('mongoose')

const config = new mongoose.Schema({
  name: { type: String, required: true }, // 玩法名称
  gid: { type: mongoose.Schema.Types.ObjectId, required: true }, // 游戏ID
  custom: { type: Object } // 自定义文档
}, { versionKey: false })

module.exports = config
