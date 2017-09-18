const turf = require('turf');

function Warehouses(config, db, bus) {
  if (!config) throw new Error('config is required')
  if (typeof (config) !== 'object') throw new Error('config is required to be an object')

  if (!db) throw new Error('db is required')
  if (!bus) throw new Error('bus is required')

  this.bus = bus
  this.warehousesCollection = db.collection('warehouses')
  this.warehousesStockCollection = db.collection('warehouses-stock')
}

Warehouses.prototype.create = function (name, address, geo, shop) {
  if (!name) throw new Error('name is required')
  if (typeof (name) !== 'string') throw new Error('name is required to be a string')

  if (!shop) throw new Error('shop is required')
  if (typeof (shop) !== 'string') throw new Error('shop is required to be a string')

  if (!address) throw new Error('address is required')
  if (typeof (address) !== 'string') throw new Error('address is required to be a string')

  if (!geo) throw new Error('geo is required');
  if (!require('geojson-validation').isPoint(geo)) throw new Error('geo is required to be a geojson point');

  return new Promise((resolve, reject) => {
    var warehouse = {
      _id: require('shortid').generate(),
      name: name,
      shop: shop,
      address: address,
      geo: geo
    }

    this.warehousesCollection.insert(warehouse, (err) => {
      if (err) return reject(err)

      resolve(warehouse._id)
    })
  })
}

Warehouses.prototype.remove = function (id) {
  if (!id) throw new Error('id is required')
  if (typeof (id) !== 'string') throw new Error('id is required to be a string')

  return new Promise((resolve, reject) => {
    this.warehousesCollection.remove({ _id: id }, (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}

Warehouses.prototype.listByShop = function (shop) {
  if (!shop) throw new Error('shop is required')
  if (typeof (shop) !== 'string') throw new Error('shop is required to be a string')

  return new Promise((resolve, reject) => {
    this.warehousesCollection.find({ shop: shop }).toArray((err, docs) => {
      if (err) return reject(err)

      resolve(docs)
    })
  })
}

Warehouses.prototype.get = function (id) {
  if (!id) throw new Error('id is required')
  if (typeof (id) !== 'string') throw new Error('id is required to be a string')

  return new Promise((resolve, reject) => {
    this.warehousesCollection.findOne({ _id: id }, (err, doc) => {
      if (err) return reject(err)

      resolve(doc)
    })
  })
}

Warehouses.prototype.getStock = function (warehouse) {
  return new Promise((resolve, reject) => {
    this.warehousesStockCollection.find({
      warehouse: warehouse
    }).toArray((err, docs) => {
      if (err) return reject(err)


      resolve(docs);
    })
  });
};

Warehouses.prototype.increaseStock = function (warehouse, product, amount) {
  // if (!id) throw new Error('id is required')
  // if (typeof (id) !== 'string') throw new Error('id is required to be a string')

  return new Promise((resolve, reject) => {
    this.warehousesStockCollection.findOne({
      warehouse: warehouse,
      product: product
    }, (err, doc) => {
      if (err) return reject(err)

      if (doc) {
        this.warehousesStockCollection.update(
          {
            warehouse: warehouse,
            product: product
          }, {
            $inc: {
              amount: amount
            }
          }, (err) => {
            if (err) return reject(err);

            resolve();
          }
        )
      } else {
        this.warehousesStockCollection.insert(
          {
            warehouse: warehouse,
            product: product,
            amount: amount
          }, (err) => {
            if (err) return reject(err);

            resolve();
          }
        )
      }
    })
  })
}

module.exports = Warehouses
