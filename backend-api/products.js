const turf = require('turf');
const escapeRegExp = require('escape-string-regexp');

function Products(config, db, bus) {
  if (!config) throw new Error('config is required');

  if (typeof (config) !== 'object') throw new Error('config is required to be an object');

  if (!db) throw new Error('db is required');
  if (!bus) throw new Error('bus is required');

  this.zonesCollection = db.collection('zones');
  this.productsCollection = db.collection('products');
  this.productsZonesCollection = db.collection('product-zones');
  this.bus = bus;
}

Products.prototype.create = function (shop, name, description, price, publicSearch, zones, pictureId) {
  if (!shop) throw new Error('shop is required');
  if (typeof (shop) !== 'string') throw new Error('shop is required to be a string');

  if (!name) throw new Error('name is required');
  if (typeof (name) !== 'string') throw new Error('name is required to be a string');

  return new Promise((resolve, reject) => {
    var productId = require('shortid').generate();
    var product = {
      _id: productId,
      shop: shop,
      name: name,
      description: description,
      price: price,
      zones: zones,
      publicSearch: publicSearch,
      picture: pictureId
    };

    this.productsCollection.insert(product, (err) => {
      if (err) return reject(err);

      resolve(productId);
    });
  });
};



Products.prototype.update = function (product, name, description, price, publicSearch, zones, pictureId) {
  return new Promise((resolve, reject) => {
    this.productsCollection.update(
      { _id: product },
      { $set: {
      name: name,
      description: description,
      price: price,
      zones: zones,
      publicSearch: publicSearch,
      picture: pictureId
    }
    }, (err) => {
      if (err) return reject(err);

      resolve();
    });
  });
};

Products.prototype.rename = function (id, name) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  if (!name) throw new Error('name is required');
  if (typeof (name) !== 'string') throw new Error('name is required to be a string');

  return new Promise((resolve, reject) => {
    this.productsCollection.update({ _id: id }, { $set: { name: name } }, (err) => {
      if (err) return reject(err);

      resolve();
    });
  });
};

Products.prototype.remove = function (id) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  return new Promise((resolve, reject) => {
    this.productsCollection.remove({ _id: id }, (err) => {
      if (err) return reject(err);

      resolve();
    });
  });
};

Products.prototype.filter = function (name, shop, zones) {
  if (!name) name = '';
  if (typeof (name) !== 'string') throw new Error('if present, name is required to be a string');

  if (!shop) shop = null;
  if (shop && typeof (shop) !== 'string') throw new Error('if present, shop is required to be a string');

  if (!zones) zones = [];
  if (!(zones instanceof Array)) throw new Error('if present, zones must be an array');
  if ((zones).filter((z) => !z || typeof (z) !== 'string').length) throw new Error('all zones must be an array');

  return new Promise((resolve, reject) => {
    var filter = {};

    if (name) filter.name = { $regex: new RegExp('/.*' + escapeRegExp(name) + '.*/') };
    if (shop) filter.shop = shop;
    if (zones.length) filter.zones = { $in: zones };


    this.productsCollection.find(filter).toArray((err, docs) => {
      if (err) return reject(err);

      resolve(docs);
    });
  });
};

Products.prototype.listByShop = function (shop) {
  if (!shop) shop = null;
  if (shop && typeof (shop) !== 'string') throw new Error('if present, shop is required to be a string');

  return new Promise((resolve, reject) => {
    this.productsCollection.find({ shop: shop }).toArray((err, docs) => {
      if (err) return reject(err);

      resolve(docs);
    });
  });
};

Products.prototype.addToZone = function (id, zone) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  if (!zone) throw new Error('zone is required');
  if (typeof (zone) !== 'string') throw new Error('zone is required to be a string');

  return new Promise((resolve, reject) => {
    this.productsCollection.update({
      _id: id
    }, {
        $addToSet: {
          'zones': zone
        }
      }, (err) => {
        if (err) return reject(err);

        resolve();
      });
  });
};

Products.prototype.removeFromZone = function (id, zone) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  if (!zone) throw new Error('zone is required');
  if (typeof (zone) !== 'string') throw new Error('zone is required to be a string');

  return new Promise((resolve, reject) => {
    this.productsCollection.update({
      _id: id
    }, {
        $pull: {
          'zones': zone
        }
      }, (err) => {
        if (err) return reject(err);

        resolve();
      });
  });
};

Products.prototype.listByCoordinates = function (latitude, longitude) {
  return new Promise((resolve, reject) => {
    var buffer = turf.buffer(turf.point([longitude, latitude]), 0.1, 'kilometers');

    this.zonesCollection.find({}).toArray((err, zonesDocs) => {
      if (err) return reject(err);

      var zonesInLocation = zonesDocs
      .filter((zoneDoc) => {
          return !!zoneDoc.geo;
      }).map((zoneDoc) => {
        return turf.feature(zoneDoc.geo, zoneDoc);
      })
        .filter((zonesGeoJson) => {
          try {
          return turf.intersect(buffer, zonesGeoJson);
          } catch (e) {
            console.error(e);
            return false;
          }
        })
        .map((zoneGeoJson) => zoneGeoJson.properties._id);

      if (zonesInLocation.length === 0) return resolve([]);

      this.productsCollection.find(
        { }
      ).toArray((err, productsDocs) => {
        if (err) return reject(err);

        resolve(productsDocs.filter((productDoc) => {
          for (var i = 0; i <zonesInLocation.length; i++ ){
            if (productDoc.zones.indexOf(zonesInLocation[i]) !== -1) return true;
          }

          return false;
        }));
      });
    });
  });
};

Products.prototype.getById = Products.prototype.get = function (id) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  return new Promise((resolve, reject) => {
    this.productsCollection.findOne({
      _id: id
    }, (err, doc) => {
      if (err) return reject(err);

      resolve(doc);
    });
  });
};

module.exports = Products;