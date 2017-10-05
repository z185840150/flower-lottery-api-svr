const [Joi] = [
  require('joi')
]

const [captcha, maker, mongo, random, redis] = [
  require('./../helpers/captcha'),
  require('./../helpers/responser/maker'),
  require('./../model/mongo'),
  require('./../helpers/random'),
  require('./../model/redis')
]

module.exports = {
  valid: {
    userlist: {
      get: {
        query: {
          per: Joi.number().integer().min(5).max(100).default(25),
          page: Joi.number().integer().min(1).default(1)
        }
      },
      post: {
        body: {
          data: Joi.array()
        }
      }
    },
    logs: {
      login: {
        get: {
          query: {
            per: Joi.number().integer().min(5).max(200).default(50),
            page: Joi.number().integer().min(1).default(1),
            uid: Joi.array().default([]),
            aid: Joi.array().default([]),
            admin: Joi.boolean().default(true),
            ip: Joi.array().items(Joi.string().min(7).max(15).default('0.0.0.0')).default([]),
            startTime: Joi.date(),
            endTime: Joi.date()
          }
        }
      }
    },
    token: {
      life: {
        get: {
          query: {
            token: Joi.string().min(10).required(),
            admin: Joi.boolean().default(false)
          }
        }
      }
    },
    conf: {
      webinfo: {
        get: {

        },
        post: {
          query: {

          },
          body: {
            name: Joi.string().min(1).max(15),
            keywords: Joi.array()
          }
        }
      }
    }
  },
  methods: {
    userlist (req, res, next) {
      if (req.route.methods.get) {
        if (res.auth) {
          mongo.user.find({}).skip((req.query.page - 1) * req.query.per).limit(req.query.per).sort({'_id': -1}).exec().then(docs => {
            let data = []
            docs.map((doc, index) => {
              data.push({
                id: doc._id,
                username: doc.username,
                nickname: doc.nickname,
                sex: doc.sex,
                wx: doc.bind.wx.openid,
                phone: doc.bind.phone.code,
                email: doc.bind.email,
                creatTime: doc.create_time,
                state: doc.state === 'active',
                parent: doc.parent
              })
            })
            maker.result(res, next, 'json', {
              result: 0,
              errmsg: '',
              data
            })
          })
        } else next()
      }
    },
    /** 日志管理 */
    logs: {
      /**
       * 登陆记录
       *
       * @param {any} req
       * @param {any} res
       * @param {any} next
       */
      login (req, res, next) {
        if (req.route.methods.get) {
          if (res.auth) {
            let conditions = {}

            if (req.query.admin && req.query.uid.length > 0) conditions.aid = { $in: req.query.uid } // aid 限制
            if (!req.query.admin && req.query.uid.length > 0) conditions.uid = { $in: req.query.uid } // uid 限制
            if (req.query.startTime || req.query.endTime) conditions.time = {} // 时间规则
            if (req.query.startTime) conditions.time.$gte = req.query.startTime // 起始时间
            if (req.query.endTime) conditions.time.$lt = req.query.endTime // 结束时间
            if (req.query.ip.length > 0) conditions.ip = { $in: req.query.ip } // ip限制

            mongo.logslogin.count(conditions, (e, count) => {
              if (e) maker.result(res, next, 'json', { result: 1004, errmsg: '请求失败' })
              else {
                mongo.logslogin.find(conditions).sort({ 'time': -1 })
                .skip((req.query.page - 1) * req.query.per)
                .limit(req.query.per)
                .populate('uid', [], 'user').populate('aid', [], 'admin')
                .exec()
                .then(docs => {
                  let data = []
                  docs.map((item, index) => {
                    data.push({
                      id: item._id,
                      uid: item.admin ? item.aid._id : item.uid._id,
                      admin: item.admin,
                      username: item.admin ? item.aid.username : item.uid.username,
                      nickname: item.admin ? item.aid.username : item.uid.nickname,
                      ip: item.ip,
                      address: item.ip_address,
                      token: item.token,
                      birthLife: item.birthLife,
                      time: item.time
                    })
                  })
                  maker.result(res, next, 'json', { result: 0, errmsg: '', data, count })
                })
              }
            })
          } else next()
        }
      }
    },
    /** 令牌管理 */
    token: {
      life (req, res, next) {
        if (req.route.methods.get) {
          redis.get(`token_${req.query.admin ? 'admin_' : ''}${req.query.token}`, (e, val) => {
            if (e) maker.result(res, next, 'json', { result: 1001, errmsg: '获取失败' })
            else if (val) {
              maker.result(res, next, 'json', { result: 0, errmsg: '', islife: true })
            } else {
              maker.result(res, next, 'json', { result: 0, errmsg: '', islife: false })
            }
          })
        }
      }
    },
    /** 配置管理 */
    conf: {
      /**
       * [GET] 获取网站信息
       * [POST] 修改网站信息
       *
       * @param {any} req
       * @param {any} res
       * @param {any} next
       */
      webinfo (req, res, next) {
        if (req.route.methods.get) {
          mongo.config.findOne().then(doc => {
            if (doc) maker.result(res, next, 'json', { result: 0, errmsg: '', data: { name: doc.base.name, keywords: doc.base.keywords } })
            else maker.result(res, next, 'json', { result: 1001, errmsg: 'config no found' })
          }).catch(e => { maker.result(res, next, 'json', { result: 1002, errmsg: 'db failed' }) })
        } else if (req.route.methods.post) {
          req.body.name && mongo.config.findOneAndUpdate({}, { 'base.name': req.body.name })
          req.body.keywords && mongo.config.findOneAndUpdate({}, { 'base.keywords': req.body.keywords })
          maker.result(res, next, 'json', { result: 0, errmsg: '', msg: 'uploading...' })
        }
      }
    },
    /** 竞彩管理 */
    sport: {
      /** 竞彩足球 */
      football: {
        /**
         * 玩法管理
         *
         * @param {any} req
         * @param {any} res
         * @param {any} next
         */
        method (req, res, next) {
          if (req.route.methods.get) {

          }
        }
      }
    }
  }
}
