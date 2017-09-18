const validEmailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const templateGenerators = require('../email-templates');

function Emails(config, db, bus) {
    if (!config) throw new Error('config is required');
    if (typeof(config) !== 'object') throw new Error('config is required to be an object');

    this.config = config;

    if (!db) throw new Error('db is required');
    if (!bus) throw new Error('bus is required');

    this.bus = bus;

    this.server = require('emailjs').server.connect(this.config.email.outgoing);
    this.blacklistedEmails = db.collection('blacklisted-emails');
}

Emails.prototype.isValidAddress = function(email) {
    if (!email) throw new Error('email is required');
    if (typeof(email) !== 'string') throw new Error('email is required to be a string');

    return Promise.resolve(!!validEmailRegex.test(email));
};

Emails.prototype.isBlacklisted = function(email) {
    if (!email) throw new Error('email is required');
    if (typeof(email) !== 'string') throw new Error('email is required to be a string');

    return new Promise((resolve, reject) => {
        this.blacklistedEmails.findOne({
            _id: email
        }, (err, doc) => {
            if (err) return reject(err);

            if (doc) return resolve(true);

            return resolve(false);
        });
    });
};


Emails.prototype.blacklist = function(email) {
    if (!email) throw new Error('email is required');
    if (typeof(email) !== 'string') throw new Error('email is required to be a string');

    return new Promise((resolve, reject) => {
        this.blacklistedEmails.findOne({
            _id: email
        }, (err, doc) => {
            if (err) return reject(err);

            if (doc) return resolve();

            this.blacklistedEmails.insert({
                _id: email
            }, (err) => {
                if (err) return reject(err);

                resolve();
            });
        });
    });
};

Emails.prototype.sendEmail = function(to, template, model) {
    return this.isBlacklisted(to)
        .then((isBlacklisted) => {
            return new Promise((resolve, reject) => {
                if (isBlacklisted) return reject(new Error('email address is blacklisted'));

                var templateGenerator = templateGenerators[template];

                if (!templateGenerator) return reject(new Error('unknown template name'));

                templateGenerator(model).then((message) => {
                    try {
                        message.to = to;
                        message.from = this.config.email.outgoing.from;

                        message = require('emailjs').message.create(message);

                        this.server.send(message, (err) => {
                            if (err) return reject(err);

                            resolve();
                        });
                    }
                    catch (e) {
                        reject(e);
                    }
                }, reject);
            });
        });
};

module.exports = Emails;
