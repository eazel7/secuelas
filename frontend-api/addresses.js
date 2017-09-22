function Addresses(api) {
    this.api = api;
}

Addresses.prototype.search = function (address) {
    return this.api.georouting.geocodeAddress(address);
};

Addresses.prototype.list = function (userToken) {
    return this.api.addresses.list(['user:' + userToken.userId]);
};

Addresses.prototype.create = function (userToken, name, address, geo) {
    return this.api.addresses.create(
        name,
        address,
        geo,
        ['user:' + userToken.userId]
    );
};

module.exports = Addresses;