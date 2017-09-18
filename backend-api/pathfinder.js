const Combinatorics = require('js-combinatorics');

function PathfinderAPI(config, db, bus) {
    this.cachedCostsCollection = db.collection('cached-costs');
    this.carriersCollection = db.collection('carriers');
    this.customerLocationsCollection = db.collection('customer-locations');

    this.config = config;
}

function queryOsrm(url, source, destination) {
    return new Promise((resolve, reject) => {
        url = url + '/route/v1/driving/' +
            source[0].toString() + ',' + source[1].toString() + ';' +
            destination[0].toString() + ',' + destination[1].toString() +
            '?overview=full&alternatives=true&steps=true';

        require('request').get(url, (err, res, body) => {
            if (err) return reject(err);
            if (res.statusCode !== 200) return reject(new Error(body));

            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(e);
            }
        });
    })
}

PathfinderAPI.prototype.getFastestRoute = function (source, destination) {
    var getCoordinates = (id) => {
        var kinds = {
            'carriers': {
                collection: this.carriersCollection,
                id: (id) => {
                    return id.slice('carriers:'.length);
                }
            },
            'customer-locations': {
                collection: this.customerLocationsCollection,
                id: (id) => {
                    return id.slice('customer-locations:'.length);
                }
            }
        };

        return new Promise((resolve, reject) => {
            var kindName = id.slice(0, id.indexOf(':'));
            var kind = kinds[kindName];

            if (!kind) return Promise.reject(new Error('unknown kind'));

            kind.collection.findOne({ _id: kind.id(id) }, (err, doc) => {
                if (err) return reject(err);
                if (!doc) return reject(new Error('invalid ', kindName));;
                if (!doc.location) return reject(new Error('no location set'));;

                return resolve(doc.location.coordinates);
            });
        });
    };

    return new Promise((resolve, reject) => {
        this.cachedCostsCollection.findOne({
            source: source,
            destination: destination
        }, (err, doc) => {
            if (err) return reject(err);
            if (doc) return resolve(doc.cost);

            Promise.all([
                getCoordinates(source),
                getCoordinates(destination)
            ]).then((locations) => {
                queryOsrm(
                    this.config.osrm,
                    locations[0],
                    locations[1]
                ).then((result) => {
                    var fastest = result.routes.sort((r1, r2) => r1.duration - r2.duration)[0];

                    if (!fastest) return reject('No route');

                    if (source.indexOf('carriers:') === 0) return resolve(fastest);

                    this.cachedCostsCollection.insert({
                        source: source,
                        destination: destination,
                        route: fastest,
                        cost: fastest.duration
                    }, (err) => {
                        if (err) return reject(err);

                        resolve(fastest);
                    })
                }, reject)
            }, reject);
        })
    })
}

PathfinderAPI.prototype.optimize = function (carriers, stops) {
    return new Promise((resolve, reject) => {
        var allBranches = [];

        carriers.forEach((carrier) => {
            var carrierStops = Combinatorics.permutationCombination(stops).toArray();

            carrierStops.forEach((carrierStop) => {
                allBranches.push({
                    cost: 0,
                    carrier: carrier,
                    stops: carrierStop
                });
            })
        })

        require('async').eachSeries(
            allBranches,
            (branch, callback) => {
                var steps = branch.steps = [{ cost: 0, source: branch.carrier, destination: branch.stops[0] }];

                for (var i = 0; i < branch.stops.length - 1; i++) {
                    steps.push({ cost: 0, source: branch.stops[i], destination: branch.stops[i + 1] });
                }

                require('async')
                    .eachSeries(
                    steps,
                    (step, callback) => {
                        this.getFastestRoute(step.source, step.destination).then((route) => {
                            step.cost = route.duration;
                            step.route = route;

                            callback();
                        }, (err) => {
                            step.imposible = true;

                            callback({ imposible: true });
                        });
                    },
                    (err) => {
                        if (err && err.imposible) {
                            branch.imposible = true;

                            return callback();
                        }

                        branch.cost = 0;

                        branch.steps.forEach((step) => branch.cost += step.cost);

                        callback();
                    }
                    );
            },
            (err) => {
                allBranches = allBranches.filter((branch) => !branch.imposible);

                var branchesPermutated = Combinatorics.power(allBranches).filter(function (branches) {
                    if (branches.length === 0) return false;

                    var covering = [];
                    var cost = 0;

                    branches.forEach((branch) => branch.stops.forEach((stop) => covering.push(stop)));

                    for (var i = 0; i < covering.length; i++) {
                        if (covering.lastIndexOf(covering[i]) !== i) return false;
                    };

                    return true;
                }).map((branches) => {
                    var covering = [];
                    var cost = 0;

                    branches.forEach((branch) => {
                        cost += branch.cost;
                        branch.stops.forEach((stop) => covering.push(stop));
                    });

                    return {
                        cost: cost,
                        covering: covering,
                        branches: branches
                    };
                })
                    .filter((branches) => {
                        for (var i = 0; i < branches.covering.length; i++) {
                            if (branches.covering.lastIndexOf(branches.covering[i]) !== i) return false;
                        }

                        return true;
                    })
                    .sort((branches1, branches2) => {
                        if (branches1.covering.length > branches2.covering.length) return -1;
                        else if (branches2.covering.length > branches1.covering.length) return 1;
                        else if (branches1.cost < branches2.cost) return -1;

                        return 1;
                    })

                if (!branchesPermutated.length) return reject(new Error('no possible routes'));

                var result = {};

                branchesPermutated[0].branches.forEach((branch) => {
                    result[branch.carrier] = branch;
                })

                resolve(result);
            }
        )
    });
};

module.exports = PathfinderAPI;