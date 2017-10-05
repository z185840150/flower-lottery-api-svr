const mongoose = require('mongoose')

const friendLinks = new mongoose.Schema({
  name: { type: String, required: true, default: '' }, // 友情链接名称
  link: { type: String, required: true, default: '' }, // 友情链接网址
  actived: { type: Boolean, default: true, required: true } // 友情链接是否生效
}, { versionKey: false })

module.exports = friendLinks
