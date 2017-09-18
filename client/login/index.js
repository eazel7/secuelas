require('angular')
    .module(
    (module.exports = 'cerovueltas.login'),
    [
        require('angular-material'),
        require('angular-messages'),
        require('angular-ui-router'),
        require('../api'),
        require('../local-storage')
    ]
    )
    .service(
    'LoginService',
    [
        '$mdDialog',
        'API',
        'LocalStorage',
        '$q',
        '$rootScope',
        function ($mdDialog, API, LocalStorage, $q, $rootScope) {
            return {
                showLoginDialog: function () {
                    $mdDialog.show({
                        template: require('raw-loader!./log-in.html'),
                        controller: 'LoginDialogController',
                        controllerAs: 'ctrl'
                    });
                },
                setUserToken: function (userToken) {
                    LocalStorage.userToken = userToken;

                    $scope.$emit('user-changed');

                    return $q.resolve();
                },
                getUserToken: function () {
                    var userToken = LocalStorage.userToken;

                    if (!userToken) return $q.reject();
                    return $q.resolve(userToken);
                }
            };
        }
    ])
    .run([
        'LoginService',
        function (LoginService) {
            LoginService.getUserToken()
                .then(
                null,
                function () {
                    LoginService.showLoginDialog();
                });
        }
    ])
    .controller(
        'LoginDialogController',
        [
            '$mdDialog',
            function LoginDialogController($mdDialog) {
                this.createNewAccount = function () {
                    $mdDialog.show({
                        template: require('raw-loader!./create-new-account.html'),
                        controller: 'CreateNewAccountController',
                        controllerAs: 'ctrl'
                    })
                };
                this.existingAccount = function () {
                    $mdDialog.show({
                        template: require('raw-loader!./existing-account.html'),
                        controller: 'ExistingAccountController',
                        controllerAs: 'ctrl'
                    })
                };
            }
        ]
    )
    .controller(
        'CreateNewAccountController',
        [
            '$scope',
            'API',
            '$mdDialog',
            'LoginService',
            function ($scope, API, $mdDialog, LoginService) {
                const passwordStrength = require('zxcvbn');
                var ctrl = this;

                ctrl.email = '';
                ctrl.password = '';
                
                var stopWatchingPassword = $scope.$watch(function () {
                    return ctrl.password;
                }, function (password) {
                    var strength = passwordStrength(ctrl.password);
                    
                    ctrl.passwordScore = strength.score;
                });
                
                ctrl.canConfirm = function () {
                    return !ctrl.working && !$scope.signup.$invalid && ctrl.passwordScore > 2;
                };
                
                ctrl.confirm = function () {
                    ctrl.serverError = null;

                    API.auth.createUser(ctrl.email, ctrl.password)
                    .then(function (userToken) {
                        LoginService
                        .setUserToken(userToken)
                        .then(function () {
                            stopWatchingPassword();
                            
                            $mdDialog.hide();
                        });
                    }, function (err) {
                        ctrl.serverError = err;
                        ctrl.working = false;
                    })
                };
                
                ctrl.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        ]
    )
    .controller(
        'ExistingAccountController',
        [
            '$scope',
            'API',
            '$mdDialog',
            'LoginService',
            function ($scope, API, $mdDialog, LoginService) {
                var ctrl = this;

                ctrl.email = '';
                ctrl.password = '';
                
                ctrl.canConfirm = function () {
                    return !ctrl.working && !$scope.signup.$invalid;
                };
                
                ctrl.confirm = function () {
                    ctrl.serverError = null;

                    API.auth.getTokenWithCredentials(ctrl.email, ctrl.password)
                    .then(function (userToken) {
                        LoginService
                        .setUserToken(userToken)
                        .then(function () {                           
                            $mdDialog.hide();
                        });
                    }, function (err) {
                        ctrl.serverError = err;
                        ctrl.working = false;
                    })
                };
                
                ctrl.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        ]
    )