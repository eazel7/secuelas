function CustomerLocations (config, db, bus) {
  if (!config) throw new Error('config is required')
  if (typeof (config) !== 'object') throw new Error('config is required to be an object')

  if (!db) throw new Error('db is required')
  if (!bus) throw new Error('bus is required')

  this.bus = bus
  this.customerLocationsCollection = db.collection('customer-locations')
}

CustomerLocations.prototype.create = function (name, customer, latitude, longitude, address) {
  if (!name) throw new Error('name is required')
  if (typeof (name) !== 'string') throw new Error('name is required to be a string')

  if (!customer) throw new Error('customer is required')
  if (typeof (customer) !== 'string') throw new Error('customer is required to be a string')

  if (typeof (latitude) !== 'number') throw new Error('latitude is required to be a number')
  if (typeof (longitude) !== 'number') throw new Error('longitude is required to be a number')

  if (!address) throw new Error('address is required')
  if (typeof (address) !== 'string') throw new Error('address is required to be a string')

  return new Promise((resolve, reject) => {
    var point = {
      'type': 'Point',
      'coordinates': [longitude, latitude]
    }

    var customerLocation = {
      _id: require('shortid').generate(),
      name: name,
      customer: customer,
      location: point,
      address: address
    }

    this.customerLocationsCollection.insert(customerLocation, (err) => {
      if (err) return reject(err)

      resolve(customerLocation._id)
    })
  })
}

CustomerLocations.prototype.rename = function (id, name) {
  if (!id) throw new Error('id is required')
  if (typeof (id) !== 'string') throw new Error('id is required to be a string')

  if (!name) throw new Error('name is required')
  if (typeof (name) !== 'string') throw new Error('name is required to be a string')

  return new Promise((resolve, reject) => {
    this.customerLocationsCollection.update({ _id: id }, { $set: { name: name } }, (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}

CustomerLocations.prototype.remove = function (id) {
  if (!id) throw new Error('id is required')
  if (typeof (id) !== 'string') throw new Error('id is required to be a string')

  return new Promise((resolve, reject) => {
    this.customerLocationsCollection.remove({ _id: id }, (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}

CustomerLocations.prototype.listByCustomer = function (customer) {
  if (!customer) throw new Error('customer is required')
  if (typeof (customer) !== 'string') throw new Error('customer is required to be a string')

  return new Promise((resolve, reject) => {
    this.customerLocationsCollection.find({ customer: customer }).toArray((err, docs) => {
      if (err) return reject(err)

      resolve(docs)
    })
  })
}

CustomerLocations.prototype.listByCoordinates = function (latitude, longitude) {
  if (!latitude) throw new Error('latitude is required')
  if (typeof (latitude) !== 'number') throw new Error('latitude is required to be a number')

  if (!longitude) throw new Error('longitude is required')
  if (typeof (longitude) !== 'number') throw new Error('longitude is required to be a number')

  return new Promise((resolve, reject) => {
    this.customerLocationsCollection.find({ customer: customer }).toArray((err, docs) => {
      if (err) return reject(err)

      resolve(docs)
    })
  })
}

CustomerLocations.prototype.getById = function (id) {
  if (!id) throw new Error('id is required')
  if (typeof (id) !== 'string') throw new Error('id is required to be a string')

  return new Promise((resolve, reject) => {
    this.customerLocationsCollection.findOne({ _id: id }, (err, doc) => {
      if (err) return reject(err)
      if (!doc) return reject(new Error('invalid customer location'));

      resolve(doc)
    })
  })
}

module.exports = CustomerLocations
