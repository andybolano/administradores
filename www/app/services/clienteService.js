(function () {
    'use strict';

    angular
        .module('app')
        .service('clienteService', clienteService);

    /* @ngInject */
    function clienteService($http,$q, API_URL, $ionicLoading,$timeout) {

        var service = {
            get: get,
        
        };
        return service;

        function get(id){
           var defered = $q.defer();
            var promise = defered.promise;
              var timeoutPromise = $timeout(function ()
                      {
                          canceler.resolve();
                          $ionicLoading.hide();
                          message("Conexión lenta, intente nuevamente");
                      },10000);
                      var canceler = $q.defer();
            $http.get(API_URL+'/cliente/'+id).then(success, error);
            return promise;
             function success(p) {
                  $timeout.cancel(timeoutPromise);
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
                 $timeout.cancel(timeoutPromise);
            }
        };
    }
})();



