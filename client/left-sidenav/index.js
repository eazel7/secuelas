require('angular')
.module(
(module.exports = 'left-sidenav'),
[
    require('angular-material'),
    require('angular-material-icons'),
    require('angular-ui-router')
]
)
.value(
'LeftSidenavLinks',
[
]
)
.directive(
'leftSidenav',
function () {
    return {
        template: require('raw-loader!./template.html'),
        replace: true,
        controller: function ($scope, $state, LeftSidenavLinks, LeftSidenavService, API, LocalStorage, $timeout) {
            $scope.links = LeftSidenavLinks;

            $scope.click = function (l) {
                $state.go(l.stateName).then(function () {
                    LeftSidenavService.close();
                })
            };

            $scope.last = function (l) {
                return l.last;
            };

            $scope.notLast = function (l) {
                return !l.last;
            };
        },
        controllerAs: 'ctrl'
    }
}
)
.controller(
'LeftSidenavToggle',
function (LeftSidenavService) {
    this.toggleSidenav = LeftSidenavService.toggle;
}
)
.service("LeftSidenavService", function ($mdSidenav, $rootScope) {
    var attachOnClose = function () {
        $mdSidenav('left').onClose(function () {
            $rootScope.$broadcast('left-sidenav-close');

            attachOnClose();
        });
    };

    attachOnClose();

    return {
        open: function () {
            return $mdSidenav('left').open()
        },
        toggle: function () {
            return $mdSidenav('left').toggle();
        },
        isOpen: function () {
            return $mdSidenav('left').isOpen()
        },
        close: function () {
            return $mdSidenav('left').close();
        }
    }
});