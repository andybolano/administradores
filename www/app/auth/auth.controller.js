(function () {
    'use strict';
    angular
            .module('auth')
            .controller('AuthCtrl', AuthCtrl);

    /* @ngInject */

    function AuthCtrl(authService, $state, HOME, $ionicLoading) {
         var vm = this;
        vm.usuario = {};
        vm.logo =false;
        vm.iniciarSesion = iniciarSesion;
        vm.hideLogo = hideLogo;
        vm.showLogo = showLogo;
       
       function hideLogo(){
         vm.logo = true;
        }
        function showLogo(){
          vm.logo = false;
        }
        
    
        
         function iniciarSesion(){
           if (vm.usuario.user === undefined || vm.usuario.user === "") {
                message("Ingresar Usuario");
                return 0;
            }
            if (vm.usuario.clave === undefined || vm.usuario.clave === "") {
                message("Ingresar Contraseña");
                return 0;
            };

            $ionicLoading.show();
            var object = {
                email:vm.usuario.user,
                password:vm.usuario.clave
            };           
            authService.login(object).then(success, error);
            function success(d) { 
                 if (d.data.respuesta === true) {                    
                     $ionicLoading.hide();
                     $state.go(HOME);                                                    
                }else{
                     $ionicLoading.hide(); 
                     message(d.data.message);
                     return false;
                }
            }
            function error(error) {
                $ionicLoading.hide();
                message("Tiempo de respuesta agotado, verifique su conexion");
            }
        }
        
        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
        
       
    }
})();





