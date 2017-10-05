const mongoose = require('mongoose')

const config = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId }, // 用户ID
  aid: { type: mongoose.Schema.Types.ObjectId }, // 管理员ID
  admin: { type: Boolean, default: false }, // 管理员?
  time: { type: Date, default: new Date() }, // 登录时间
  ip: { type: String }, // IP地址
  ip_address: { // IP归属地
    country: { type: String, default: '' }, // 国家
    area: { type: String, default: '' }, // 区域
    region: { type: String, default: '' }, // 省份
    city: { type: String, default: '' }, // 城市
    county: { type: String, default: '' }, // 村镇
    isp: { type: String, default: '' } // 运营商
  },
  token: { type: String, required: true }, // 授权Token
  birthLife: { type: Number, default: 15 * 60 } // 初始生命周期
}, { versionKey: false })

module.exports = config
