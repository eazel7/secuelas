function ProductsAPI(api) {
    this.api = api;
}

ProductsAPI.prototype.create = function (userToken, name, description, shopId) {
    if (!userToken || !userToken.userId) return Promise.reject(new Error('debe iniciar sesión'));

    return this.api.shops.filter(null, userToken.userId)
        .then((shops) => {
            if (!shops.filter((shop) => shop._id === shopId).length) return Promise.reject(new Error('no es dueño del local'));

            return this.api.products.create(shopId, name, description, null, false, [], null);
        });
};

ProductsAPI.prototype.listByZone = function (userToken, zoneId) {
    return this.api.products.filter(null, null, [zoneId]);
};

ProductsAPI.prototype.listByShop = function (userToken, shopId) {
    if (!userToken || !userToken.userId) return Promise.reject(new Error('debe iniciar sesión'));

    return this.api.shops.filter(null, userToken.userId)
        .then((shops) => {
            if (!shops.filter((shop) => shop._id === shopId).length) return Promise.reject(new Error('no es dueño del local'));

            return this.api.products.filter(null, shopId);
        });
};

ProductsAPI.prototype.getById = function (productId) {
    return this.api.products.getById(productId)
        .then((product) => {
            return product;
        })
};

module.exports = ProductsAPI;