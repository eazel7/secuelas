function AccessCodesAPI(config, db, bus) {
    this.codesCollection = db.collection('codes');
}

AccessCodesAPI.prototype.get = function (code) {
    return new Promise((resolve, reject) => {
        this.codesCollection.findOne({_id: code}, (err, doc) => {
            if (err) return reject(err);
            if (!doc) return reject(new Error('invalid code'));

            resolve(doc.info);
        });
    });
};


AccessCodesAPI.prototype.listByTag = function (tag) {
    return new Promise((resolve, reject) => {
        this.codesCollection.find({tag: tag}).toArray((err, docs) => {
            if (err) return reject(err);

            resolve(docs);
        });
    });
};

AccessCodesAPI.prototype.forget = function (code) {
    return new Promise((resolve, reject) => {
        this.codesCollection.remove({_id: code}, (err) => {
            if (err) return reject(err);

            resolve();
        });
    });
};

AccessCodesAPI.prototype.create = function (info, tag) {
    var code = {
        _id: require('shortid').generate(),
        info: info,
        tag: tag,
        createdAt: new Date()
    };
    
    return new Promise((resolve, reject) => {
        this.codesCollection.insert(code, (err) => {
            if (err) return reject(err);

            resolve(code._id);
        });
    });
};

module.exports = AccessCodesAPI;