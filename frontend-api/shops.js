function ShopsAPI(api) {
    this.api = api;
}

ShopsAPI.prototype.create = function (name, address, geo, userToken) {
    if(!userToken) return Promise.reject(new Error('no inició sesión'));
    
    return this.api.shops.create(name, userToken.userId).then((shop) => {
        return this.api.warehouses.create(name, address, geo, shop._id)
        .then(() => {
            return shop._id;
        })
    });
};

ShopsAPI.prototype.getById = function (shopId) {
    return this.api.shops.getById(shopId);
};

ShopsAPI.prototype.remove = function (userToken, shopId) {
    if(!userToken) return Promise.reject(new Error('no inició sesión'));
    
    return this.api.shops.filter(null, userToken.userId)
    .then((shops) => {
        if (!shops.filter((shop) => shop._id === shopId).length) return Promise.reject(new Error('no es dueño del local'));

        return this
        .api
        .warehouses
        .listByShop(shopId)
        .then((warehouses) => {
            return Promise.all(
                warehouses.map((warehouse) => {
                    return this.api.warehouses.remove(warehouse._id);
                })
            );
        })
        .then(() => {
            return this.api.products.listByShop(shopId)
            .then((products) => {
                return products.map((product) => {
                    return this.api.products.remove(product._id);
                });
            });
        });
    });
};

ShopsAPI.prototype.list = function (userToken) {
    if(!userToken) return Promise.reject(new Error('no inició sesión'));
    
    return this.api.shops.filter(null, userToken.userId);
};

module.exports = ShopsAPI;