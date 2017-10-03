require('angular')
.module(
(module.exports = 'right-sidenav'),
[
    require('angular-material'),
    require('angular-ui-router')
]
)
.directive(
'rightSidenav',
function () {
    return {
        template: require('raw-loader!./template.html'),
        replace: true,
        controllerAs: 'rightSidenavCtrl',
        controller: function ($scope, RightSidenavService) {
            var ctrl = this

            ctrl.isOpen = function () {
                return RightSidenavService.isOpen();
            };

            ctrl.isLocked = function () {
                return RightSidenavService.isLocked();
            };

            $scope.$on('right-sidenav-lock', function () {
                ctrl.locked = true;
            })

            $scope.$on('right-sidenav-unlock', function () {
                ctrl.locked = false;
            })

        }
    }
}
)
.service("RightSidenavService", function ($mdSidenav, $rootScope, $q) {
    var self = {
        open: function () {
            if (self.isOpen()) return $q.resolve();
            
            $rootScope.$broadcast('right-sidenav-start-open');

            return $mdSidenav('right').open().then(function () {
                $rootScope.$broadcast('right-sidenav-open');
                $rootScope.$broadcast('right-sidenav-end-open');
            });
        },
        toggle: function () {
            if (self.isOpen()) return self.close();
            else return self.open();
        },
        isOpen: function () {
            return $mdSidenav('right').isOpen()
        },
        isLocked: function () {
            return $mdSidenav('right').isLockedOpen();
        },
        lock: function () {
            if (self.isLocked()) return Promise.resolve();

            $rootScope.$broadcast('right-sidenav-lock');
            return Promise.resolve();
        },
        unlock: function () {
            if (!self.isLocked()) return Promise.resolve();
            
            $rootScope.$broadcast('right-sidenav-unlock');
            
            return Promise.resolve();
        },
        close: function () {
            if (!self.isOpen()) return;
            
            $rootScope.$broadcast('right-sidenav-start-close');

            return $mdSidenav('right').close().then(function () {
                $rootScope.$broadcast('right-sidenav-close');
                $rootScope.$broadcast('right-sidenav-end-close');
            });
        }
    }
    
    return self;
});