const mongoose = require('mongoose')

const config = new mongoose.Schema({
  dc_openid: { type: String, required: true, default: '' }, // 数据中心开放ID
  base: { // 基本信息
    name: { type: String, required: true, default: '竞彩网' }, // 网站名称
    icon: { // 图标
      fid: { type: mongoose.Schema.Types.ObjectId, required: true }, // 文件ID
      format: { type: String, default: 'jpg', required: true } // 文件格式
    },
    pc: {
      name: { type: String, required: true, default: 'cc竞彩' }, // PC站名称
      keywords: { type: Array, required: true, default: [] } // PC站关键字
    },
    admin: {
    }
  },
  safe: { // 安全性
    rate: { // 频率限制
      enable: { type: Boolean, default: true, required: true }, // 是否开启
      max: { type: Number, default: 60, require: true }, // 时间段内最多访问次数
      windowsMS: { type: Number, default: 60 * 1000, require: true }, // 时间段
      delayAfter: { type: Number, default: 30, require: true }, // 延迟发生在X次后
      delayMS: { type: Number, default: 2 * 1000, require: true } // 延迟时间
    }
  }
}, { versionKey: false })

module.exports = config
