(function () {
    'use strict';
    angular
            .module('app')
            .controller('MenuCtrl', MenuCtrl);
    /* @ngInject */
    function MenuCtrl(authService, $ionicLoading,$location,$state) {
        var vm = this;
        vm.usuario = {};
        vm.sitio = {};
        vm.logout = logout;
        
        
      vm.usuario = JSON.parse(localStorage.getItem("data"));
      vm.usuario.correo = localStorage.getItem("email");
      vm.sitio = JSON.parse(localStorage.getItem('sitio'));
        
         vm.isActive = function(viewLocation){
                    return viewLocation === $location.path();
           }
                
       function logout(){
                      authService.logout().then(success, error);
                      function success(d) {
                          localStorage.clear();
                          sessionStorage.clear();
                           message("sesión finalizada!");
                             $state.go('login',{},{reload: true});
                        }
                        function error(error) {
                           messge(error.data.error);
                        }
                }
                
         function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
    }
})();






