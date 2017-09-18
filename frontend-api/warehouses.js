function WarehousesAPI(api){
    this.api = api;
}

WarehousesAPI.prototype.get = function (id) {
    return this.api.warehouses.get(id);
};

WarehousesAPI.prototype.listByShop = function (userToken, shopId) {
    if(!userToken) return Promise.reject(new Error('no inició sesión'));
    
    return this.api.shops.filter(null, userToken.userId)
    .then((shops) => {
        if (!shops.filter((shop) => shop._id === shopId).length) return Promise.reject(new Error('no es dueño del local'));

        return this.api.warehouses.listByShop(shopId);
    });
};

module.exports = WarehousesAPI;