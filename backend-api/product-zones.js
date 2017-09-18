function ProductZones(config, db, bus) {
    if (!config) throw new Error('config is required')

    if (typeof (config) !== 'object') throw new Error('config is required to be an object')

    if (!db) throw new Error('db is required')
    if (!bus) throw new Error('bus is required')

    this.productsCollection = db.collection('products')
    this.bus = bus
}

ProductZones.prototype.getZonesByProduct = function (id) {
    if (!id) throw new Error('id is required');
    if (typeof (id) !== 'string') throw new Error('id is required to be a string');

    return new Promise((resolve, reject) => {
        this.productsCollection.findOne({
            _id: id
        }, (err, doc) => {
            if (err) return reject(err);

            resolve(doc.zones);
        });
    });
}

ProductZones.prototype.putProductInZone = function (product, zone) {
    if (!product) throw new Error('product is required');
    if (typeof (product) !== 'string') throw new Error('product is required to be a string');

    if (!zone) throw new Error('zone is required');
    if (typeof (zone) !== 'string') throw new Error('zone is required to be a string');

    return new Promise((resolve, reject) => {
        this.productsCollection.findOne({
            _id: product
        }, (err, doc) => {
            if (err) return reject(err);
            if (!doc) return reject(new Error('invalid product'));

            if (doc.zones.indexOf(zone) !== -1) return resolve();

            doc.zones.push(zone);

            this.productsCollection.update({
                _id: product
            }, {
                    $set: {
                        zones: doc.zones
                    }
                }, (err) => {
                    if (err) return reject();

                    resolve();
                })
        });
    });
}


ProductZones.prototype.removeProductFromZone = function (product, zone) {
    if (!product) throw new Error('product is required');
    if (typeof (product) !== 'string') throw new Error('product is required to be a string');

    if (!zone) throw new Error('zone is required');
    if (typeof (zone) !== 'string') throw new Error('zone is required to be a string');

    return new Promise((resolve, reject) => {
        this.productsCollection.findOne({
            _id: product
        }, (err, doc) => {
            if (err) return reject(err);
            if (!doc) return reject(new Error('invalid product'));

            doc.zones.splice(doc.zones.indexOf(zone), 1);

            this.productsCollection.update({
                _id: product
            }, {
                    $set: {
                        zones: doc.zones
                    }
                }, (err) => {
                    if (err) return reject(err);

                    resolve();
                });
        });
    });
};

module.exports = ProductZones;