const NodeRSA = require('node-rsa');

function Tokens(config, db, bus) {
    this.rsa = new NodeRSA(config.rsa.privateKey);
}

Tokens.prototype.encrypt = function (info) {
    try {
        var encrypted = this.rsa.encrypt(new Buffer(JSON.stringify(info)));


        return Promise.resolve(encrypted.toString('base64'));
    } catch (e) {
        return Promise.reject(e);
    }
};

Tokens.prototype.decrypt = function (token) {
    try {
        return Promise.resolve(JSON.parse(this.rsa.decrypt(new Buffer(token, 'base64')).toString()));
    } catch (e) {
        return Promise.reject(e);
    }
};

module.exports = Tokens;
    