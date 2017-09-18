function Gateway (config, db, bus) {
  if (!config) throw new Error('config is required')
  if (typeof (config) !== 'object') throw new Error('config is required to be an object')

  if (!db) throw new Error('db is required')
  if (!bus) throw new Error('bus is required')

  this.bus = bus
}

module.exports = Gateway
