const dwGen = require('diceware-generator');

function Users(config, db, bus) {
    if (!config) throw new Error('config is required');
    if (typeof (config) !== 'object') throw new Error('config is required to be an object');

    if (!db) throw new Error('db is required');
    if (!bus) throw new Error('bus is required');

    this.bus = bus;
    this.usersCollection = db.collection('users');

    this.wordlist = {
        'sp': () => require('diceware-wordlist-sp')
    }[config.language]();
}

Users.prototype.create = function (tags, profile) {
    if (!tags) throw new Error('tags are required');

    if (!profile) throw new Error('profile is required');
    if (typeof (profile) !== 'object') throw new Error('profile is required to be an object');

    return new Promise((resolve, reject) => {
        var id = require('shortid').generate();
        var user = {
            _id: id,
            tags: tags,
            profile: profile
        };

        this.usersCollection.insert(user, (err) => {
            if (err) return reject(err);

            this.bus.emit('new-user', id);

            resolve(id);
        });
    });
};

Users.prototype.findByTag = function (tag) {
    if (!tag) throw new Error('tag is required');
    if (typeof (tag) !== 'string') throw new Error('tag is required to be a string');

    return new Promise((resolve, reject) => {
        this.usersCollection.find({
            tags: {
                $in: [tag]
            }
        }).toArray((err, docs) => {
            if (err) return reject(err);

            resolve(docs);
        });
    });
};

Users.prototype.get = function (id) {
    if (!id) throw new Error('id is required');
    if (typeof (id) !== 'string') throw new Error('id is required to be a string');

    return new Promise((resolve, reject) => {
        this.usersCollection.findOne({
            _id: id
        }, (err, doc) => {
            if (err) return reject(err);

            resolve(doc);
        });
    });
};

Users.prototype.list = function () {
    return new Promise((resolve, reject) => {
        this.usersCollection.find({}).toArray((err, docs) => {
            if (err) return reject(err);

            resolve(docs);
        });
    });
};

Users.prototype.generateRandomPassword = function () {
    return Promise.resolve(dwGen({
        language: this.wordlist,
        wordcount: 3, // Default 6
        format: 'string', // Default 'string'. One of [array, string]
    }).toLowerCase());
};

Users.prototype.setPassword = function (id, password) {
    if (!id) return Promise.reject(new Error('user id is required'));
    if (typeof (id) !== 'string') return Promise.reject(new Error('user id is required to be a string'));

    if (!password) return Promise.reject(new Error('password is required'));
    if (typeof (password) !== 'string') return Promise.reject(new Error('password is required to be a string'));

    var passwordHash = require('password-hash').generate(password);

    return new Promise(
        (resolve, reject) => {
            this.usersCollection.update({
                _id: id
            }, {
                    $set: {
                        passwordHash: passwordHash
                    }
                },
                (err) => {
                    if (err) return reject(err);

                    resolve();
                });
        });
};

Users.prototype.verifyPassword = function (id, password) {
    if (!id) return Promise.reject(new Error('id is required'));
    if (typeof (id) !== 'string') return Promise.reject(new Error('id is required to be a string'));

    if (!password) return Promise.reject(new Error('password is required'));
    if (typeof (password) !== 'string') return Promise.reject(new Error('password is required to be a string'));

    return new Promise((resolve, reject) => {
        this
            .usersCollection
            .findOne(
            { _id: id },
            (err, doc) => {
                if (err) return reject(err);
                if (!doc) return Promise.reject(new Error('invalid user id'));
                if (!doc.passwordHash) return Promise.reject(new Error('user has not password set'));

                return resolve(require('password-hash').verify(password, doc.passwordHash));
            }
            );
    });
};

module.exports = Users;
