const escapeRegExp = require('escape-string-regexp')

function Customers(config, db, bus) {
  if (!config) throw new Error('config is required')

  if (typeof (config) !== 'object') throw new Error('config is required to be an object')

  if (!db) throw new Error('db is required')
  if (!bus) throw new Error('bus is required')

  this.customersCollection = db.collection('customers')
  this.bus = bus
}

Customers.prototype.listAll = function () {
  return new Promise((resolve, reject) => {
    this.customersCollection.find({}).toArray((err, docs) => {
      if (err) return reject(err)

      resolve(docs)
    })
  })
}

Customers.prototype.create = function (name, creator) {
  if (!name) throw new Error('name is required')
  if (typeof (name) !== 'string') throw new Error('name is required to be a string')

  if (!creator) throw new Error('creator is required')
  if (typeof (creator) !== 'string') throw new Error('creator is required to be a string')

  var customer = {
    _id: require('shortid').generate(),
    name: name,
    enabled: true,
    owners: [creator]
  }

  return new Promise((resolve, reject) => {
    this.customersCollection.insert(customer, (err) => {
      if (err) return reject(err)

      resolve(customer._id)
    })
  })
}

Customers.prototype.filter = function (name, owner) {
  if (!name) name = ''
  if (typeof (name) !== 'string') throw new Error('if present, name is required to be a string')

  if (typeof (owner) !== 'string' && owner) throw new Error('if present, owner is required to be a string')

  return new Promise((resolve, reject) => {
    var filter = {}

    if (name) filter.name = { $regex: new RegExp('/.*' + escapeRegExp(name) + '.*/') }
    if (owner) filter.owners = { $in: [owner] }

    this.customersCollection.find(filter).toArray((err, docs) => {
      if (err) return reject(err)

      resolve(docs)
    })
  })
}

Customers.prototype.remove = function (id) {
  if (!id) throw new Error('id is required')
  if (typeof (id) !== 'string') throw new Error('id is required to be a string')

  return new Promise((resolve, reject) => {
    this.customersCollection.remove({ _id: id }, (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}

Customers.prototype.get = function (id) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  return new Promise((resolve, reject) => {
    this.customersCollection.findOne({ _id: id }, (err, doc) => {
      if (err) return reject(err);

      resolve(doc);
    })
  })
}

Customers.prototype.enable = function (id) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  return new Promise((resolve, reject) => {
    this.customersCollection.update({ _id: id }, { $set: { enabled: true } }, (err) => {
      if (err) return reject(err);

      resolve();
    })
  })
}

Customers.prototype.disable = function (id) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  return new Promise((resolve, reject) => {
    this.customersCollection.update({ _id: id }, { $set: { enabled: false } }, (err) => {
      if (err) return reject(err);

      resolve();
    })
  })
}

module.exports = Customers
