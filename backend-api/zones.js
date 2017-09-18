const turf = require('turf');

function Zones(config, db, bus) {
  if (!config) throw new Error('config is required')

  if (typeof (config) !== 'object') throw new Error('config is required to be an object')

  if (!db) throw new Error('db is required')
  if (!bus) throw new Error('bus is required')

  this.zonesCollection = db.collection('zones')
  this.zonesCollection.createIndex({ 'geo': '2dsphere' })

  this.bus = bus
}

Zones.prototype.create = function (name, shop, geo) {
  if (!name) throw new Error('name is required')
  if (typeof (name) !== 'string') throw new Error('name is required to be a string')

  if (!shop) throw new Error('shop is required')
  if (typeof (shop) !== 'string') throw new Error('shop is required to be a string')

  if (!geo) throw new Error('geo is required')

  if (!require('geojson-validation').isGeometryObject(geo)) throw new Error('geo is required to be a GeoJSON geometry object')

  var area = require('turf').area(geo)

  if (area === 0) throw new Error('geo is required to cover an area greater than 0')

  return new Promise((resolve, reject) => {
    var zone = {
      _id: require('shortid').generate(),
      name: name,
      shop: shop,
      geo: geo,
      active: true
    }

    this.zonesCollection.insert(zone, (err) => {
      if (err) return reject(err)

      resolve(zone._id)
    })
  })
}

Zones.prototype.get = function (id) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  return new Promise((resolve, reject) => {
    this.zonesCollection.findOne({ _id: id }, (err, doc) => {
      if (err) return reject(err);

      resolve(doc);
    })
  })
}

Zones.prototype.deactivate = function (zone) {
  if (!zone) throw new Error('zone is required');
  if (typeof (zone) !== 'string') throw new Error('zone is required to be a string');

  return new Promise((resolve, reject) => {
    this.zonesCollection.update({ _id: zone }, { $set: { active: false } }, (err) => {
      if (err) return reject(err);

      resolve();
    });
  })
}

Zones.prototype.listByShop = function (shop) {
  if (!shop) throw new Error('shop is required')
  if (typeof (shop) !== 'string') throw new Error('shop is required to be a string')

  return new Promise((resolve, reject) => {
    this.zonesCollection.find({ shop: shop }).toArray((err, docs) => {
      if (err) return reject(err)

      resolve(docs)
    })
  })
}

Zones.prototype.listByLocation = function (latitude, longitude) {
  if (typeof (latitude) !== 'number') throw new Error('latitude is required to be a number')
  if (typeof (latitude) !== 'number') throw new Error('latitude is required to be a number')

  if (typeof (longitude) !== 'number') throw new Error('longitude is required to be a number')
  if (typeof (longitude) !== 'number') throw new Error('longitude is required to be a number')

  return new Promise((resolve, reject) => {
    var buffer = turf.buffer(turf.point([longitude, latitude]), 0.1, 'kilometers');

    this.zonesCollection.find({}).toArray((err, zonesDocs) => {
      if (err) return reject(err);

      var zones = zonesDocs.map((zoneDoc) => {
        return turf.feature(zoneDoc.location);
      })
        .filter((geo) => {
          return turf.intersect(geo, buffer);
        })
        .map((geo) => geo.properties);

      resolve(zones);
    });
  });
};

module.exports = Zones
