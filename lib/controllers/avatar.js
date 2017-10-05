const [fs, Joi, jwt, moment, path] = [
  require('fs'),
  require('joi'),
  require('jwt-simple'),
  require('moment'),
  require('path')
]

const [crypto, maker, mongo, redis] = [
  require('./../helpers/crypto'),
  require('./../helpers/responser/maker'),
  require('./../model/mongo'),
  require('./../model/redis')
]

module.exports = {
  valid: {
    base: {
      get: {
        query: {
          uid: Joi.strict().required(), // 用户 ID
          admin: Joi.boolean().default(false) // 管理员?
        }
      }
    }
  },
  methods: {
    base (req, res, next) {
      console.log(1)
      if (req.route.methods.get) {
        const model = req.query.admin ? mongo.admin : mongo.user

        model.findById(req.query.uid).then(doc => {
          if (doc) {
            mongo.userFiles.findOne({ _id: doc.avatar, uid: req.query.uid, admin: req.query.admin }).then(doc2 => {
              if (doc2) {
                mongo.files.findById(doc2.fid).then(doc3 => {
                  if (doc3) {
                    let filepath = path.join(__dirname, `./../../files/${doc3.md5}-${doc3.sha1}`)
                    console.log(filepath)
                    fs.stat(filepath, (err, stats) => {
                      if (err) maker.result(res, next, 'json', { result: 1003, errmsg: '物理文件不存在' })
                      else {
                        fs.readFile(filepath, (err, data) => {
                          if (err) maker.result(res, next, 'json', { result: 1004, errmsg: '物理文件损坏' })
                          else {
                            switch (doc2.format) {
                              case 'png':
                                data = Buffer.from(data, 'base64')
                                maker.result(res, next, 'png', data)
                                break
                              case 'jpg':
                              default:
                                data = Buffer.from(data, 'base64')
                                maker.result(res, next, 'jpg', data)
                            }
                          }
                        })
                      }
                    })
                  } else maker.result(res, next, 'json', { result: 1002, errmsg: '文件不存在' })
                })
              } else maker.result(res, next, 'json', { result: 1002, errmsg: '文件不存在' })
            })
          } else maker.result(res, next, 'json', { result: 1001, errmsg: '用户不存在' })
        })
      }
    }
  }
}
