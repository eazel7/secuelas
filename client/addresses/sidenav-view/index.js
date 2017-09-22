require('angular')
.module(
    (module.exports = 'cerovueltas.addresses.sidenav-view'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('../../left-sidenav')
    ]
)
.constant('AddressesLeftSidenavViewTemplate', require('raw-loader!./template.html'))
.controller(
    'AddressesLeftSidenavViewController',
    function AddressesLeftSidenavViewController (addresses, $state, LeftSidenavService) {
        this.goCreate = () => {
            $state.go('cerovueltas.addresses.create').then(() => LeftSidenavService.close());
        };
        
        this.goToAddress = (addresses) => {
            $state.go('cerovueltas.addresses.detail', {addresses: addresses._id})
            .then(() => {
                LeftSidenavService.close();
            })
        };
        this.activeAddress = (address) => {
            return $state.params.address === address._id;
        }
        this.addresses = addresses;
    }
);