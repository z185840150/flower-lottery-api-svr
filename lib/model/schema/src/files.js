// 文件表
const mongoose = require('mongoose')

const files = new mongoose.Schema({
  md5: { type: String, required: true, min: 32, max: 32 }, // md5
  sha1: { type: String, required: true } // sha1
}, { versionKey: false })

module.exports = files
