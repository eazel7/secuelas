function AuthAPI(api) {
    this.api = api;
}

AuthAPI.prototype.createUser = function (email, password) {
    var emailTag = 'email:' + email;

    return this.api.users.findByTag(emailTag).then((user) => {
        if (user.length) return Promise.reject(new Error('email ya existe'));

        return this.api.users.create([
            emailTag
        ], {
                email: email
            })
            .then((userId) => {
                return this.api.users.setPassword(userId, password)
                    .then(() => {
                        return this.api.tokens.encrypt({
                            userId: userId
                        });
                    })
            });
    });
};

AuthAPI.prototype.getTokenWithCredentials = function (email, password) {
    var emailTag = 'email:' + email;

    return this.api.users.findByTag(emailTag).then((users) => {
        if (!users.length) return Promise.reject(new Error('email inválido'));

        var userId = users[0]._id;
        
        return this.api.users.verifyPassword(userId, password)
            .then((valid) => {
                if (valid) {
                    return this.api.tokens.encrypt({
                        userId: userId
                    });
                } else return Promise.reject(new Error('contraseña incorrecta'));
            });
    });
};

AuthAPI.prototype.getUserEmail = function (userToken) {
    if(!userToken) return Promise.reject(new Error('no inició sesión'));
    
    return this.api.users.get(userToken.userId).then(function (user) {
        return user.profile.email;
    });
};

module.exports = AuthAPI;