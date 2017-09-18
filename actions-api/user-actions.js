const validEmailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function UserActionsAPI(config, api) {
  this.config = config;
  this.api = api;
}

UserActionsAPI.prototype.isValidEmail = function(email) {
  if (!email) return Promise.reject(new Error('email is required'));
  if (typeof(email) !== 'string') return Promise.reject(new Error('email is required to be a string'));

  if (!validEmailRegex.test(email)) return Promise.reject(new Error('invalid email address'));

  return Promise.resolve();
};

UserActionsAPI.prototype.createUser = function(email, realName, systemWideRole) {
  return this.isValidEmail(email)
    .then(() => {
      if (!realName) return Promise.reject(new Error('real name is required'));
      if (typeof(realName) !== 'string') return Promise.reject(new Error('real name is required to be a string'));
    })
    .then(() => {
      if (!({
          'none': true,
          'instance-admin': true
        }[systemWideRole])) return Promise.reject('invalid system wide role');
    })
    .then(() => {
      var tags = ['email:' + email, 'system-wide-role:' + systemWideRole];

      return this.api.users.create(tags, {
        email: email,
        realName: realName
      });
    })
    .then((id) => {
      return this.api.accessCodes.create({
          userId: id,
          kind: 'email-verification'
        }, 'email-verification:' + email)
        .then((verificationCode) => {
          var model = {
            code: verificationCode,
            realName: realName
          };

          var body = require('mustache').Render(model, this.config.verifyEmailAddress);
          var subject = require('mustache').Render(model, this.config.verifyEmailAddress.subject);

          return this.api.emails.sendEmail(email, subject, body)
            .then(() => {
              return id;
            });
        });
    });
};

module.exports = UserActionsAPI;
