require('shortid').characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$');

const Carriers = require('./carriers');
const AccessCodes = require('./access-codes');
const Certificates = require('./certificates');
const CustomerLocations = require('./customer-locations');
const Customers = require('./customers');
const Domains = require('./domains');
const Emails = require('./emails');
const Gateway = require('./gateway');
const Georouting = require('./georouting');
const Orders = require('./orders');
const Products = require('./products');
const Shops = require('./shops');
const Users = require('./users');
const ProductZones = require('./product-zones');
const Warehouses = require('./warehouses');
const Zones = require('./zones');
const ScheduledDeliveries = require('./scheduled-deliveries');
const Pathfinder = require('./pathfinder');

function API (config, db, bus) {
  this.accessCodes = new AccessCodes(config, db, bus);
  this.carriers = new Carriers(config, db, bus);
  this.certificates = new Certificates(config, db, bus);
  this.customerLocations = new CustomerLocations(config, db, bus);
  this.customers = new Customers(config, db, bus);
  this.domains = new Domains(config, db, bus);
  this.emails = new Emails(config, db, bus);
  this.gateway = new Gateway(config, db, bus);
  this.georouting = new Georouting(config, db, bus);
  this.orders = new Orders(config, db, bus);
  this.products = new Products(config, db, bus);
  this.productZones = new ProductZones(config, db, bus);
  this.shops = new Shops(config, db, bus);
  this.users = new Users(config, db, bus);
  this.scheduledDeliveries = new ScheduledDeliveries(config, db, bus);
  this.warehouses = new Warehouses(config, db, bus);
  this.zones = new Zones(config, db, bus);
  this.codes = new AccessCodes(config, db, bus);
  this.pathfinder = new Pathfinder(config, db, bus);
}

module.exports = API;
