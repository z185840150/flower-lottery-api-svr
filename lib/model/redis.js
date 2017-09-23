const [redis] = [require('redis')]
const [config] = [require('./../../config/redis')]

const client = redis.createClient(config.port, config.address)

typeof config.password === 'string' &&
config.password.length > 0 &&
client.auth(config.password)

module.exports = client
