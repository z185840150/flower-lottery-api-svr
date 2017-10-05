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
    info: {
      base: {
        get: {
          query: {
            type: Joi.string().alphanum().min(4).max(16).default('pc')
          }
        },
        post: {
          body: {
            data: Joi.array()
          }
        }
      },
      friendlinks: {
        get: {
          query: {

          }
        },
        delete: {
          query: {
            id: Joi.string().alphanum().min(24).max(24).required()
          }
        },
        post: {
          query: {
            do: Joi.string().alphanum().min(1).max(16).default('edit')
          },
          body: {
            data: Joi.array().items(Joi.object().keys({
              _id: Joi.string().alphanum().min(24).max(24),
              name: Joi.string().min(2).max(10).required(),
              link: Joi.string().uri().min(6).max(80).required(),
              actived: Joi.boolean().required()
            })).min(1).required()
          }
        }
      }
    }
  },
  methods: {
    info: {
      base (req, res, next) {
        if (req.route.methods.get) {
          switch (req.query.type) {
            case 'app':
              break

            case 'pc':
            default:

              mongo.config.findOne()
              .then(doc => {
                if (doc) {
                  // 判断如果为管理员权限授权请求 那么返回全部的 友情链接, 否则只返回激活状态的友情链接
                  mongo.friendLinks.find(res.auth ? {} : { actived: true }).then(docs => maker.result(res, next, 'json', docs
                    ? { result: 0, errmsg: '', name: doc.base.pc.name || '', keywords: doc.base.pc.keywords || [], friendlinks: docs }
                    : { result: 1001, errmsg: '查询失败' }))
                } else maker.result(res, next, 'json', { result: 1001, errmsg: '查询失败' })
              })
              .catch(e => { maker.result(res, next, 'json', { result: 1001, errmsg: '查询失败' }) })
          }
        } else if (req.route.methods.post) {

        }
      },
      friendlinks (req, res, next) {
        if (req.route.methods.post) { // 编辑或提交一个新的
          if (res.auth) {
            switch (req.query.do) {
              case 'add':
                mongo.friendLinks.create(req.body.data).then(docs => {
                  maker.result(res, next, 'json', { result: 0, errmsg: '' })
                })
                break
              case 'edit':
                let values = []
                req.body.data.map((item, index) => { values.push(mongo.friendLinks.findByIdAndUpdate(item.id, { name: item.name, link: item.link, actived: item.actived })) })
                Promise.all(values).then(results => { maker.result(res, next, 'json', { result: 0, errmsg: '' }) })
                break
              default:
            }
          } else next()
        } else if (req.route.methods.delete) { // 删除一个
          if (res.auth) {
            console.log(123)
            mongo.friendLinks.remove({ _id: req.query.id }).then(result => {
              maker.result(res, next, 'json', { result: 0, errmsg: '' })
            })
          }
        }
      }
    }
  }
}
