const request = require('request');
const OpenGeocoder = require('node-open-geocoder');
const Nominatim = require('node-nominatim2');

function Georouting(config, db, bus) {
  if (!config) throw new Error('config is required');
  if (typeof (config) !== 'object') throw new Error('config is required to be an object');

  this.config = config;

  if (!db) throw new Error('db is required');
  if (!bus) throw new Error('bus is required');

  this.bus = bus;
  this.carriersCollection = db.collection('carriers');

  this.geocoder = new OpenGeocoder(config.nominatim);
  this.nominatim = new Nominatim({
    useragent: 'Cero Vueltas',
    referer: 'https://cerovueltas.com.ar',
    timeout: 10000
  });
}

Georouting.prototype.geocodeAddress = function (address) {
  return new Promise((resolve, reject) => {
    if (!(/.+\b\d+/.test(address))) return reject(new Error('address to short'));
    
    this.nominatim.search({q: address}, (err, res, data) => {
      if (err) return reject(err);

      resolve(data.map((res) => {
        return {
          location: {
            latitude: res.lat,
            longitude: res.lon
          },
          address: {
            road: res.address.road,
            country: res.address.country,
            state: res.address.state,
            stateDistrict: res.address.suburb
          }
        };
      }));
    });
  });
};

Georouting.prototype.geocodeLocation = function (latitude, longitude) {
  return new Promise((resolve, reject) => {
    this.nominatim.reverse({
      lat: latitude,
      lon: longitude
    }, (err, res, data) => {
      if (err) return reject(err);

      if (res.statusCode !== 200) return reject(new Error('error querying nominatim'));

      resolve(res.body);
    });
  });
};

Georouting.prototype.solveTravelingSalesman = function (addresses) {
  return new Promise((resolve, reject) => {
    var coordinates = [];

    addresses.forEach((address) => {
      coordinates.push(address.location.coordinates);
    });

    var url = this.config.osrm + '/trip/v1/driving/' +
      coordinates.map((c) => {
        return c.map((n) => n.toString()).join(',');
      }).join(';') +
      '?overview=full&steps=true&geometries=polyline';

    request(
      url,
      (err, response, body) => {
        if (err) return reject(err);
        if (response.statusCode !== 200) return reject(JSON.parse(body));

        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

Georouting.prototype.getRoute = function (addresses) {
  return new Promise((resolve, reject) => {
    var coordinates = [];

    addresses.forEach((address) => {
      coordinates.push(address.location.coordinates);
    });

    var url = this.config.osrm + '/route/v1/driving/' +
      coordinates.map((c) => {
        return c.map((n) => n.toString()).join(',');
      }).join(';') +
      '?alternatives=false&steps=true&continue_straight=true&geometries=polyline&overview=false';

    request(
      url,
      (err, response, body) => {
        if (err) return reject(err);
        if (response.statusCode !== 200) return reject(JSON.parse(body));

        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

module.exports = Georouting;
