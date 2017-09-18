function ScheduledDeliveriesAPI(config, db, bus) {
    if (!config) throw new Error('config is required')
    if (typeof (config) !== 'object') throw new Error('config is required to be an object')

    if (!db) throw new Error('db is required')
    if (!bus) throw new Error('bus is required')

    this.scheduledDeliveriesCollection = db.collection('scheduled-deliveries')
    this.ordersCollection = db.collection('orders')
    this.bus = bus
}

ScheduledDeliveriesAPI.prototype.getById = function (scheduledDelivery) {
    return new Promise((resolve, reject) => {
        this.scheduledDeliveriesCollection.findOne({
            _id: scheduledDelivery
        }, (err, doc) => {
            if (err) return reject(err);
            if (!doc) return reject(new Error('invalid scheduled delivery'));

            resolve(doc);
        })
    })
}


ScheduledDeliveriesAPI.prototype.setDeliveryDate = function (scheduledDelivery, deliveryDate) {
    return new Promise((resolve, reject) => {
        this.scheduledDeliveriesCollection.update({
            _id: scheduledDelivery
        }, {
            $set: {
                deliveryDate: deliveryDate
            }   
        }, (err) => {
            if (err) return reject(err);

            resolve();
        })
    })
}

ScheduledDeliveriesAPI.prototype.listByCarrier = function (carrier) {
    return new Promise((resolve, reject) => {
        this.scheduledDeliveriesCollection.find({
            carrier: carrier
        }).toArray((err, docs) => {
            if (err) return reject(err);

            resolve(docs);
        })
    })
}

ScheduledDeliveriesAPI.prototype.listByShop = function (shop) {
    return new Promise((resolve, reject) => {
        this.scheduledDeliveriesCollection.find({
            shop: shop
        }).toArray((err, docs) => {
            if (err) return reject(err);

            resolve(docs);
        })
    })
}

ScheduledDeliveriesAPI.prototype.create = function (shop, orders, departureDate, trip, carrier) {
    var scheduledDelivery = {
            _id: require('shortid').generate(),
            shop: shop,
            orders: orders,
            departureDate: departureDate,
            trip: trip,
            carrier: carrier
        };

        
    return (new Promise((resolve, reject) => {
        this.scheduledDeliveriesCollection.insert(scheduledDelivery, (err) => {
            if (err) return reject(err);

            resolve(scheduledDelivery._id)
        });
    }))
};

module.exports = ScheduledDeliveriesAPI;