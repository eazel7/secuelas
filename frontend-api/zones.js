function ZonesAPI(api) {
    this.api = api;
}

ZonesAPI.prototype.listByShop = function (userToken, shopId) {
    if (!userToken || !userToken.userId) return Promise.reject(new Error('debe iniciar sesión'));

    return this.api.shops.filter(null, userToken.userId)
        .then((shops) => {
            if (!shops.filter((shop) => shop._id === shopId).length) return Promise.reject(new Error('no es dueño del local'));

            return this.api.zones.listByShop(shopId);
        });
};

ZonesAPI.prototype.addProduct = function (zoneId, productId) {
    return this.api.productZones.putProductInZone(productId, zoneId);
}

ZonesAPI.prototype.getById = function (userToken, zoneId) {
    return this.api.zones.get(zoneId);
};

ZonesAPI.prototype.create = function (userToken, name, geo, shopId) {
    if (!userToken || !userToken.userId) return Promise.reject(new Error('debe iniciar sesión'));

    return this.api.shops.filter(null, userToken.userId)
        .then((shops) => {
            if (!shops.filter((shop) => shop._id === shopId).length) return Promise.reject(new Error('no es dueño del local'));

            return this.api.zones.create(name, shopId, geo);
        });
};

module.exports = ZonesAPI;