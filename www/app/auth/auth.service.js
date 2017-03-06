(function () {
    'use strict';

    angular
            .module('auth')
            .service('authService', authService);

    /* @ngInject */
    function authService($http, API_URL, $state, $window, $ionicHistory, $q, $ionicLoading,$timeout) {


        var service = {
            login: login,
            session:session,
            currentUser: currentUser,
            logout: logout,
            autologin: autologin,
            registro:registro,
         

        };
        return service;

        function session(){
            var defered = $q.defer();
            var promise = defered.promise;
            
            var timeoutPromise = $timeout(function ()
            {
                canceler.resolve();
                $ionicLoading.hide();
                message("Tiempo de respuesta agotado, verifique su conexion");
            }, 8000);

            $ionicLoading.show();
            var canceler = $q.defer();
            
            $http.get(API_URL+'sesion', {timeout: canceler.promise}).then(success, error);
            return promise;

            function success(p) {
                $timeout.cancel(timeoutPromise);
                storeSession(p.data);
                defered.resolve(p.data);
            }
            function error(error) {
                $timeout.cancel(timeoutPromise);
                destroyCredenciales();
                defered.reject(error);
            }
        }
        function login(user) {
           var defered = $q.defer();
            var promise = defered.promise;
           
              
            $http.post(API_URL+'usuarioOnline/autenticar',user).then(success, error);
            return promise;

            function success(p) {
            
              defered.resolve(p);
              storeUser(p.data);
            }
            function error(error) {
                destroyCredenciales();
                defered.reject(error);
            }
        } ;
        
        function registro(object){
            var defered = $q.defer();
            var promise = defered.promise;
        
            $http.post(API_URL+'/administrador',object).then(success, error);
            return promise;

            function success(p) {
              defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        };
      

        function storeSession(session) {
            $window.sessionStorage['token'] = JSON.stringify(session);
        };
        
        function storeUser(usuario) {
            $window.localStorage['usuario'] = usuario.request;
        };
        function currentUser() {            
            return JSON.parse(localStorage.getItem('usuario'));
        }
        ;

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
        function logout() {
            $ionicLoading.show({template:'Cerrando Sesion....'});
            destroyCredenciales();
            setTimeout(function () {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                $ionicLoading.hide();
                $state.go('login',{},{reload: true});
                
                }, 30);
            //});
        }
        ;
        function destroyCredenciales() {
            localStorage.clear();
            sessionStorage.clear();
        }
        
         function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
    }



})();


