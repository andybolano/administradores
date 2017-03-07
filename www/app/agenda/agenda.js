(function () {
    'use strict';
    angular.module('agenda', [])
            .config(function ($stateProvider) {
                $stateProvider
                        .state('usuario.agenda', {
                            url: '/agenda',
                            templateUrl: 'app/agenda/agenda.html',
                            controller: 'agendaCtrl as vm'
                        })
            });
})();
(function () {
    'use strict';

    angular
            .module('agenda')
            .controller('agendaCtrl', AgendaCtrl);
    /* @ngInject */
    function AgendaCtrl($ionicLoading, $q, $timeout,$scope,reservasService,sessionService) {
    var vm = this;
  
    }
})();



