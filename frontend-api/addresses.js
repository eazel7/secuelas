function Addresses(api) {
    this.api = api;
}

Addresses.prototype.search = function (address) {
    return this.api.georouting.geocodeAddress(address);
};

module.exports = Addresses;