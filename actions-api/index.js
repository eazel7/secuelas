const UsersActionsAPI = require('./user-actions');

function ActionsAPI(api) {
    this.userActions = new UsersActionsAPI(api);
}

module.exports = ActionsAPI;