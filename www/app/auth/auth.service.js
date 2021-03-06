(function () {
    'use strict';

    angular
            .module('auth')
            .service('authService', authService);

    /* @ngInject */
    function authService($http, API_URL, $ionicHistory, $q, $ionicLoading,$timeout) {


        var service = {
            login: login,
            currentUser: currentUser,
            logout: logout,
            autologin: autologin,
            registro:registro,

        };
        return service;

        function login(user) {
           var defered = $q.defer();
            var promise = defered.promise;
             var timeoutPromise = $timeout(function ()
                      {
                          canceler.resolve();
                          $ionicLoading.hide();
                          message("Tiempo de respuesta agotado, verifique su conexion");
                      },10000);
                      var canceler = $q.defer();
            $http.post(API_URL+'/authenticate',user,{timeout: canceler.promise}).then(success, error);
            return promise;

            function success(p) {
                $timeout.cancel(timeoutPromise);
              defered.resolve(p);
              if(p.data.respuesta === true){
                    storeUser(p.data);
                }
            }
            function error(error) {
                $timeout.cancel(timeoutPromise);
                destroyCredenciales();
                defered.reject(error);
            }
        } ;
        
     
        
        function registro(object){
            var defered = $q.defer();
            var promise = defered.promise;
        var timeoutPromise = $timeout(function ()
                      {
                          canceler.resolve();
                          $ionicLoading.hide();
                          message("Tiempo de respuesta agotado, verifique su conexion");
                      },10000);
                      var canceler = $q.defer();
            $http.post(API_URL+'/administrador',object,{timeout: canceler.promise}).then(success, error);
            return promise;

            function success(p) {
                 $timeout.cancel(timeoutPromise);
              defered.resolve(p);
            }
            function error(error) {
                 $timeout.cancel(timeoutPromise);
                defered.reject(error);
            }
        };
      


        function storeUser(data) {
            var data = JSON.parse("[" + data.user + "]");
            localStorage.setItem('data',JSON.stringify(data[0].administrador));
            localStorage.setItem('sitio',JSON.stringify(data[0].sitio));
            localStorage.setItem('email',data[0].email);
            localStorage.setItem('token',data[0].token);
            localStorage.setItem('userIsLogin',true);
        };
        function currentUser() {            
            return JSON.parse(localStorage.getItem('data'));
        }
        

        function autologin() {
            var defered = $q.defer();
            var promise = defered.promise;
            var usuario = currentUser();
            if (usuario) {
                defered.resolve(usuario);
            } else {
                defered.resolve(false);
            }
            return promise;
        }
        
            function logout(){ 
            $ionicLoading.show({template:'Cerrando Sesion....'});
           var defered = $q.defer();
            var promise = defered.promise;
            $http.post(API_URL+'/logout').then(success, error);
            return promise;
             function success(p) {
                 
            destroyCredenciales();
            setTimeout(function () {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                $ionicLoading.hide();
                }, 30);
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        };
            
            
       
       
        function destroyCredenciales() {
            localStorage.clear();
            sessionStorage.clear();
        }
        
         function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
    }



})();


