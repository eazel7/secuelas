function Orders(config, db, bus) {
  if (!config) throw new Error('config is required')
  if (typeof (config) !== 'object') throw new Error('config is required to be an object')

  if (!db) throw new Error('db is required')
  if (!bus) throw new Error('bus is required')

  this.bus = bus
  this.customerLocationsCollection = db.collection('customer-locations')
  this.ordersCollection = db.collection('orders')
  this.productsCollection = db.collection('products')
  this.orderProductsCollection = db.collection('order-products')
  this.orderLogsCollection = db.collection('order-logs')
}

Orders.prototype.create = function (customerLocation) {
  return new Promise((resolve, reject) => {

    this.customerLocationsCollection.findOne({ _id: customerLocation }, (err, customerLocationDoc) => {
      if (err) return reject(err);
      if (!customerLocationDoc) return reject(new Error('invalid customer location'));

      var order = {
        _id: require('shortid').generate(),
        customer: customerLocationDoc.customer,
        customerLocation: customerLocation,
        status: 'created',
        createdAt: new Date()
      };

      this.ordersCollection.insert(order, (err) => {
        if (err) return reject(err);

        this.orderLogsCollection.insert({
          _id: require('shortid').generate(),
          order: order._id,
          action: 'created'
        }, (err) => {
          if (err) return reject(err);

          resolve(order._id);

          this.bus.emit('order-created', order._id);
        })
      });
    })
  })
}

Orders.prototype.getById = function (id) {
  if (!id) throw new Error('id is required');
  if (typeof (id) !== 'string') throw new Error('id is required to be a string');

  return new Promise((resolve, reject) => {
    this.ordersCollection.findOne({ _id: id }, (err, doc) => {
      if (err) return reject(err);

      resolve(doc);
    });
  })
}

Orders.prototype.addProduct = function (order, product, amount) {
  return this.getById(order).then((orderDoc) => {
    if (!orderDoc) return Promise.reject(new Error('invalid order'));
    if (orderDoc.changesDisabled) return Promise.reject(new Error('order changes are disabled'));

    return new Promise((resolve, reject) => {
      this.orderProductsCollection.findOne(
        { order: order, product: product }
        , (err, orderProductDoc) => {
          if (err) return reject(err);

          if (!orderProductDoc) {
            this.productsCollection.findOne({ _id: product }, (err, productDoc) => {
              if (err) return reject(err);

              if (!productDoc) return reject(new Error('invalid product'));

              this.orderProductsCollection.insert({
                _id: require('shortid').generate(),
                order: order,
                product: product,
                shop: productDoc.shop,
                amount: amount
              }, (err) => {
                if (err) return reject(err);

                this.orderLogsCollection.insert({
                  _id: require('shortid').generate(),
                  order: order,
                  action: 'added-product',
                  product: product,
                  amount: amount,
                  date: Date.now()
                }, (err) => {
                  if (err) return reject(err);

                  resolve();
                })
              })
            })
          } else {
            this.orderProductsCollection.update({
              _id: orderProductDoc._id
            }, {
                $set: {
                  amount: orderProductDoc.amount + amount
                }
              }, (err) => {
                if (err) return reject(err);

                resolve();
              })
          }
        })
    });
  })
}

Orders.prototype.listProducts = function (order) {
  if (!order) throw new Error('order is required');
  if (typeof (order) !== 'string') throw new Error('order is required to be a string');

  return new Promise((resolve, reject) => {
    this.orderProductsCollection.find({ order: order }).toArray((err, docs) => {
      if (err) return reject(err);

      resolve(docs);
    })
  })
}

Orders.prototype.changeLocation = function (order, customerLocation) {
  throw new Error('not implemented')
}

Orders.prototype.setDeliveryDate = function (order, deliveryDate) {
  if (!order) throw new Error('order is required');
  if (typeof (order) !== 'string') throw new Error('order is required to be a string');

  if (!deliveryDate) throw new Error('delivery date is required');
  if (!(deliveryDate instanceof Date)) throw new Error('delivery date is required to be a date');

  return new Promise((resolve, reject) => {
    this.ordersCollection.update({ _id: order }, { $set: { status: 'scheduled', deliveryDate: deliveryDate } }, (err) => {
      if (err) return reject(err);

      resolve();
    })
  })
}

Orders.prototype.disableChanged = function (order) {
  if (!order) throw new Error('order is required');
  if (typeof (order) !== 'string') throw new Error('order is required to be a string');

  return new Promise((resolve, reject) => {
    this.ordersCollection.update({ _id: order }, { $set: { changesDisabled: true } }, (err) => {
      if (err) return reject(err);

      resolve();
    })
  })
}

Orders.prototype.setInTransit = function (customer, customerLocation) {
  throw new Error('not implemented')
}

Orders.prototype.setCancelled = function (order) {
  throw new Error('not implemented')
}

Orders.prototype.setDelivered = function (order) {
  throw new Error('not implemented')
}

Orders.prototype.allocate = function (order, allocation) {
  throw new Error('not implemented')
}

Orders.prototype.listPendingByCustomer = function (customer) {
  return new Promise((resolve, reject) => {
    this.ordersCollection.find({
      customer: customer,
      status: 'pending'
    }).toArray((err, orderDocs) => {
      if (err) return reject(err);

      resolve(orderDocs);
    })
  });
}

Orders.prototype.listByCustomerLocation = function (customerLocation) {
  return new Promise((resolve, reject) => {
    this.ordersCollection.find({
      customerLocation: customerLocation
    }).toArray((err, orderDocs) => {
      if (err) return reject(err);

      resolve(orderDocs);
    })
  });
}

Orders.prototype.listScheduledByCustomer = function (customer) {
  return new Promise((resolve, reject) => {
    this.ordersCollection.find({
      customer: customer,
      status: 'scheduled'
    }).toArray((err, orderDocs) => {
      if (err) return reject(err);

      resolve(orderDocs);
    })
  });
}

Orders.prototype.listPendingByShop = function (shop) {
  return new Promise((resolve, reject) => {
    this.ordersCollection.find({
      status: 'pending'
    }).toArray((err, orderDocs) => {
      if (err) return reject(err);

      require('async').filter(
        orderDocs,
        (orderDoc, callback) => {
          this.orderProductsCollection.count({ order: orderDoc._id, shop: shop }, (err, orderProductsCount) => {
            if (err) return callback(err);

            callback(null, orderProductsCount > 0);
          })
        },
        (err, orderDocs) => {
          if (err) return reject(err);

          resolve(orderDocs);
        }
      )
    })
  })
}

Orders.prototype.listScheduledByShop = function (shop) {
  return new Promise((resolve, reject) => {
    this.ordersCollection.find({
      status: 'scheduled'
    }).toArray((err, orderDocs) => {
      if (err) return reject(err);

      require('async').filter(
        orderDocs,
        (orderDoc, callback) => {
          this.orderProductsCollection.count({ order: orderDoc._id, shop: shop }, (err, orderProductsCount) => {
            if (err) return callback(err);

            callback(null, orderProductsCount > 0);
          })
        },
        (err, orderDocs) => {
          if (err) return reject(err);

          resolve(orderDocs);
        }
      )
    })
  })
}

Orders.prototype.filter = function (customerLocations, status) {
  var filter = {};

  if (customerLocations) filter.customerLocation = { $in: customerLocations };
  if (status) filter.status = { $in: status };

  return new Promise((resolve, reject) => {
    this.ordersCollection.find(filter).toArray((err, docs) => {
      if (err) return reject(err);

      resolve(docs);
    })
  })
}

Orders.prototype.getLogs = function (order) {
  return new Promise((resolve, reject) => {
    this.orderLogsCollection.find({ order: order }).toArray((err, docs) => {
      if (err) return reject(err);

      resolve(docs);
    })
  })
}

Orders.prototype.confirm = function (order) {
  return new Promise((resolve, reject) => {
    this.ordersCollection.update({
      _id: order
    }, {
        $set: {
          confirmedAt: new Date(),
          status: 'pending'
        }
      }, (err) => {
        if (err) return reject(err);

        this.addLogEntry(order, 'confirmed')
          .then(() => resolve(), reject);
      })
  })
}

Orders.prototype.addLogEntry = function (order, action, extra) {
  extra = extra || {};

  return new Promise((resolve, reject) => {
    var entry = {
      _id: require('shortid').generate(),
      order,
      action: action
    };

    for (var k in extra) entry[k] = extra[k];

    this.orderLogsCollection.insert(entry, (err) => {
      if (err) return reject(err);

      resolve(entry._id);
    });
  })
}

module.exports = Orders
