import redis from 'redis'
import rdConf from './../../config/redis'

const client = redis.createClient(rdConf.port, rdConf.address)

rdConf.password &&
typeof rdConf.password === 'string' &&
rdConf.password.length > 0 &&
client.auth(rdConf.password)

module.exports = client
