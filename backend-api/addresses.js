function AddressesAPI(config, db, bus) {
    this.addresses = db.collection('addresses');
}

AddressesAPI.prototype.list = function (tags) {
    if (!tags) return Promise.reject(new Error('tags are required'));
    if (!(tags instanceof Array)) return Promise.reject(new Error('tags are required to be an array'));
    if (tags.filter((tag) => typeof (tag) !== 'string').length) return Promise.reject(new Error('all tags must be of type string'));
    if (!tags.length) return Promise.reject(new Error('must provide at least one tag'));

    return new Promise(
        (resolve, reject) => {
            this.addresses.find({
                tags: {
                    $all: tags
                }
            }, (err, docs) => {
                if (err) return reject(err);

                resolve(docs);
            });
        }
    );
};

AddressesAPI.prototype.create = function (name, address, geometry, tags) {
    if (!name) return Promise.reject(new Error('name is requried'));
    if (typeof(name) !== 'string') return Promise.reject(new Error('name is requried to be a string'));

    if (!address) return Promise.reject(new Error('address is requried'));
    if (typeof(address) !== 'string') return Promise.reject(new Error('address is requried to be a string'));

    if (!geometry) return Promise.reject(new Error('geometry is requried'));
    if (!require('geojson-validation').isPoint(geo)) throw new Error('geo is required to be a geojson point');
    
    if (!tags) return Promise.reject(new Error('tags are required'));
    if (!(tags instanceof Array)) return Promise.reject(new Error('tags are required to be an array'));
    if (tags.filter((tag) => typeof (tag) !== 'string').length) return Promise.reject(new Error('all tags must be of type string'));
    if (!tags.length) return Promise.reject(new Error('must provide at least one tag'));

    return new Promise(
        (resolve, reject) => {
            this.addresses.find({
                tags: {
                    $all: tags
                }
            }, (err, docs) => {
                if (err) return reject(err);

                resolve(docs);
            });
        }
    );
};

module.exports = AddressesAPI;