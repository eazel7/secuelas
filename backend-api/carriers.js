function Carriers(config, db, bus) {
  if (!config) throw new Error('config is required')
  if (typeof (config) !== 'object') throw new Error('config is required to be an object')

  if (!db) throw new Error('db is required')
  if (!bus) throw new Error('bus is required')

  this.bus = bus
  this.carriersCollection = db.collection('carriers')
}

Carriers.prototype.addOwner = function (carrier, user) {
  if (!carrier) throw new Error('carrier is required')
  if (typeof (carrier) !== 'string') throw new Error('carrier is required to be a string')

  if (!user) throw new Error('user is required')
  if (typeof (user) !== 'string') throw new Error('user is required to be a string')

  return new Promise((resolve, reject) => {
    this.carriersCollection.findOne({
      _id: carrier
    }, (err, carrierDoc) => {
      if (err) return reject(err);
      if (!carrierDoc) return reject(new Error('invalid carrier'));

      carrierDoc.owners = carrierDoc.owners || [];

      if (carrierDoc.owners.indexOf(user) !== -1) return resolve();

      carrierDoc.owners.push(user);

      this.carriersCollection.update({
        _id: carrier
      }, {
          $set: {
            owners: carrierDoc.owners
          }
        }, (err) => {
          if (err) return reject(err);

          resolve();
        })
    });
  })
};

Carriers.prototype.listOwnedBy = function (user) {
  if (!user) throw new Error('user is required')
  if (typeof (user) !== 'string') throw new Error('user is required to be a string')

  return new Promise((resolve, reject) => {
    this.carriersCollection.find({
      owners: {
        $in: [user]
      }
    }).toArray((err, docs) => {
      if (err) return reject(err);

      resolve(docs);
    })
  })
};

Carriers.prototype.create = function (name, shop) {
  if (!name) throw new Error('name is required')
  if (typeof (name) !== 'string') throw new Error('name is required to be a string')

  if (!shop) throw new Error('shop is required')
  if (typeof (shop) !== 'string') throw new Error('shop is required to be a string')

  return new Promise((resolve, reject) => {
    var carrier = {
      _id: require('shortid').generate(),
      name: name,
      shop: shop
    }

    this.carriersCollection.insert(carrier, (err) => {
      if (err) return reject(err)

      resolve(carrier._id)
    })
  })
}

Carriers.prototype.rename = function (id, name) {
  if (!id) throw new Error('id is required')
  if (typeof (id) !== 'string') throw new Error('id is required to be a string')

  if (!name) throw new Error('name is required')
  if (typeof (name) !== 'string') throw new Error('name is required to be a string')

  return new Promise((resolve, reject) => {
    this.carriersCollection.update({ _id: id }, { $set: { name: name } }, (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}

Carriers.prototype.remove = function (id) {
  if (!id) throw new Error('id is required')
  if (typeof (id) !== 'string') throw new Error('id is required to be a string')

  return new Promise((resolve, reject) => {
    this.carriersCollection.remove({ _id: id }, (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}

Carriers.prototype.listByShop = function (shop) {
  if (!shop) throw new Error('shop is required')
  if (typeof (shop) !== 'string') throw new Error('shop is required to be a string')

  return new Promise((resolve, reject) => {
    this.carriersCollection.find({ shop: shop }).toArray((err, docs) => {
      if (err) return reject(err)

      resolve(docs)
    })
  })
}

Carriers.prototype.getById = function (id) {
  if (!id) throw new Error('id is required')
  if (typeof (id) !== 'string') throw new Error('id is required to be a string')

  return new Promise((resolve, reject) => {
    this.carriersCollection.findOne({ _id: id }, (err, doc) => {
      if (err) return reject(err)

      resolve(doc)
    })
  })
}

Carriers.prototype.updateLocation = function (id, location) {
  if (!id) throw new Error('id is required')
  if (typeof (id) !== 'string') throw new Error('id is required to be a string')

  return new Promise((resolve, reject) => {
    this.carriersCollection.update({ _id: id }, { $set: { location: location } }, (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}

module.exports = Carriers
