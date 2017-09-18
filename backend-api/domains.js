function Domains (config, db, bus) {
  if (!config) throw new Error('config is required')
  if (typeof (config) !== 'object') throw new Error('config is required to be an object')

  if (!db) throw new Error('db is required')
  if (!bus) throw new Error('bus is required')

  this.bus = bus
  this.domainsCollection = db.collection('domains')
}

Domains.prototype.getBlacklist = function () {
  return Promise.resolve([
    'repartos',
    'repartidor',
    'cliente',
    'pedidos',
    'login',
    'empezar',
    'entrar',
    'www',
    'mail',
    'zb14854482', // Zoho validation entry
    'sumate',
    'tablero',
    'control',
    'admin'
  ])
}

Domains.prototype.isAvailable = function (domainName) {
  if (!domainName) return Promise.reject(new Error('domain name is required'));
  if (typeof (domainName) !== 'string') return Promise.reject(new Error('domain name is required to be a string'));

  return this.getBlacklist().then((blacklist) => {
    if (blacklist.indexOf(domainName)) return Promise.reject(new Error('domain is blacklisted'));
    
  })
}

Domains.prototype.add = function (domainName, domainType, domainParams) {
  if (!domainName) throw new Error('domain name is required')
  if (typeof (domainName) !== 'string') throw new Error('domain name is required to be a string')

  if (!domainType) throw new Error('domain type is required')
  if (typeof (domainType) !== 'string') throw new Error('domain type is required to be a string')

  if (!domainParams) throw new Error('domain params is required')
  if (typeof (domainParams) !== 'object') throw new Error('domain params is required to be an object')

  return new Promise((resolve, reject) => {
    this.domainsCollection.count({
      domain: domainName
    }, (err, count) => {
      if (err) return reject(err)
      if (count !== 0) return reject(new Error('duplicate domain name'))

      this.domainsCollection.insert({
        domain: domainName,
        type: domainType,
        params: domainParams
      }, (err) => {
        if (err) return reject(err)

        resolve()

        this.bus.emit('new-domain', domainName, domainType, domainParams)
      })
    })
  })
}

Domains.prototype.list = function () {
  return new Promise((resolve, reject) => {
    this.domainsCollection.find({}).toArray((err, docs) => {
      if (err) return reject(err)

      resolve(docs.map((d) => {
        delete d._id

        return d
      }))
    })
  })
}

module.exports = Domains
