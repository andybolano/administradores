(function () {
    'use strict';
    angular
            .module('app')
            .controller('MenuCtrl', MenuCtrl);
    /* @ngInject */
    function MenuCtrl($scope,authService, $ionicLoading,$q,API_URL,$http,$timeout,$state) {
        $scope.usuario = {};
        $scope.showPerfil = function () {
    
            var obj = JSON.parse(localStorage.getItem("usuario"));
            if (localStorage.getItem("data_usuario") === null) {
                 $ionicLoading.show();
                 var timeoutPromise = $timeout(function()
                   {       
                      canceler.resolve(); 
                      $ionicLoading.hide();
                      message("Tiempo de respuesta agotado!");
                   },30000); 
                var canceler = $q.defer();
                 $http.get(API_URL+'cliente/'+obj[0].idCliente, {timeout: canceler.promise} )
                 .success(function(data)
                    {
                          $scope.usuario = data;
                          localStorage['data_usuario'] = JSON.stringify($scope.usuario);
                          $ionicLoading.hide();
                          $timeout.cancel(timeoutPromise);
                   });
            } else {
                $scope.usuario = JSON.parse(localStorage.getItem("data_usuario"));
            }
        };
        
        $scope.cerrarSesion = function () {
            authService.logout();
        };
         function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
        
        
        $scope.showPerfil();
    }
})();






