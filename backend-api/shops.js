const escapeRegExp = require('escape-string-regexp');

function Shops(config, db, bus) {
  if (!config) throw new Error('config is required');

  if (typeof (config) !== 'object') throw new Error('config is required to be an object');

  if (!db) throw new Error('db is required');
  if (!bus) throw new Error('bus is required');

  this.shopsCollection = db.collection('shops');
  this.shopsSettingsCollection = db.collection('shops-settings');
  this.bus = bus;
}

Shops.prototype.getSettings = function (id) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  return new Promise((resolve, reject) => {
    this.shopsSettingsCollection.findOne({ _id: id }, (err, doc) => {
      if (err) return reject(err);

      resolve(doc ? doc.settings : {});
    });
  });
};

Shops.prototype.setSettings = function (id, settings) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  if (!settings) throw new Error('settings are required');
  if (typeof (settings) !== 'object') throw new Error('settings are required to be an object');

  return new Promise((resolve, reject) => {
    this.shopsSettingsCollection.findOne({ _id: id }, (err, doc) => {
      if (err) return reject(err);

      if (doc) {
        this.shopsSettingsCollection.update({ _id: id }, { $set: { settings: settings } }, (err) => {
          if (err) return reject(err);

          resolve();
        });
      } else {
        this.shopsSettingsCollection.insert({ _id: id, settings: settings }, (err) => {
          if (err) return reject(err);

          resolve();
        });
      }
    });
  });
};

Shops.prototype.listAll = function () {
  return new Promise((resolve, reject) => {
    this.shopsCollection.find({}).toArray((err, docs) => {
      if (err) return reject(err)

      resolve(docs)
    })
  })
}

Shops.prototype.getById = function (id) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  return new Promise((resolve, reject) => {
    this.shopsCollection.findOne({ _id: id }, (err, doc) => {
      if (err) return reject(err)

      resolve(doc)
    })
  })
}

Shops.prototype.create = function (name, creator) {
  if (!name) throw new Error('name is required')
  if (typeof (name) !== 'string') throw new Error('name is required to be a string')

  if (!creator) throw new Error('creator is required')
  if (typeof (creator) !== 'string') throw new Error('creator is required to be a string')

  var shop = {
    _id: require('shortid').generate(),
    name: name,
    owners: [creator]
  }

  return new Promise((resolve, reject) => {
    this.shopsCollection.insert(shop, (err) => {
      if (err) return reject(err)

      resolve(shop)
    });
  })
}

Shops.prototype.filter = function (name, owner) {
  if (!name) name = ''
  if (typeof (name) !== 'string') throw new Error('if present, name is required to be a string')

  if (typeof (owner) !== 'string' && owner) throw new Error('if present, owner is required to be a string')

  return new Promise((resolve, reject) => {
    var filter = {}

    if (name) filter.name = { $regex: new RegExp('/.*' + escapeRegExp(name) + '.*/') }
    if (owner) filter.owners = { $in: [owner] }

    this.shopsCollection.find(filter).toArray((err, docs) => {
      if (err) return reject(err)

      resolve(docs)
    })
  })
}

Shops.prototype.remove = function (id) {
  if (!id) throw new Error('id is required')
  if (typeof (id) !== 'string') throw new Error('id is required to be a string')

  return new Promise((resolve, reject) => {
    this.shopsCollection.remove({ _id: id }, (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}

module.exports = Shops;
