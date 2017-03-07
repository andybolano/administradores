(function () {
    'use strict';
    angular
            .module('app')
            .controller('MenuCtrl', MenuCtrl);
    /* @ngInject */
    function MenuCtrl(authService, $ionicLoading,$location,$state) {
        var vm = this;
        vm.usuario = {};
        vm.logout = logout;
        
      vm.usuario = JSON.parse(localStorage.getItem("data"));
      vm.usuario.correo = localStorage.getItem("email")
        
         vm.isActive = function(viewLocation){
                    return viewLocation === $location.path();
           }
                
        function logout () {
            authService.logout();
        };
         function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
    }
})();






