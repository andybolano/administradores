(function () {
    'use strict';
    angular.module('auth', [])
        .config(function ($stateProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    cache: false,
                    templateUrl: 'app/auth/auth.html',
                    controller: 'AuthCtrl',
                    data: {
                        noRequiresLogin: true
                    }
                })
                .state('registro', {
                    url: '/registro',
                    cache: false,
                    templateUrl: 'app/auth/registro.html',
                    controller: 'registroCtrl',
                });
        });
})();


