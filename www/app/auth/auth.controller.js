(function () {
    'use strict';
    angular
            .module('auth')
            .controller('AuthCtrl', AuthCtrl);

    /* @ngInject */

    function AuthCtrl($scope, authService, $state, HOME, $ionicLoading, $window) {
        $scope.usuario = {};
        $scope.logo =false;
    
       
        $scope.hideLogo = function(){
                    $scope.logo = true;
        }
        $scope.showLogo = function(){
            $scope.logo = false;
        }
        
    
        
         $scope.iniciarSesion = function(){
           if ($scope.usuario.user === undefined) {
                message("Ingresar Usuario");
                return 0;
            }
            if ($scope.usuario.user == undefined) {
                message("Ingresar Contraseña");
                return 0;
            };

            $ionicLoading.show();
            var object = {
                username:$scope.usuario.user,
                pass:$scope.usuario.clave,
                _token:$scope.usuario.token
            };           
            authService.login(object).then(success, error);
            function success(d) { 
          
                 if (d.data.message === "Correcto") {                    
                      $ionicLoading.hide();
                     $state.go(HOME);                                                    
                } else{
                     $ionicLoading.hide(); 
                     message(d.data.request);
                     localStorage.clear();
                }
   
            }
            function error(error) {
                $ionicLoading.hide();
                message("Verifica tu conexión");
            }
        }
        
        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
        
       
    }
})();






