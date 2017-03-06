(function () {
    'use strict';
    angular.module('home', [])
            .config(function ($stateProvider) {
                $stateProvider
                        .state('usuario.home', {
                            url: '/home',
                            templateUrl: 'app/home/home.html',
                            controller: 'homeCtrl as vm'
                        })
            });
})();
(function () {
    'use strict';

    angular
            .module('home')
            .controller('homeCtrl', HomeCtrl);
    /* @ngInject */
    function HomeCtrl($ionicLoading, $q, $timeout,reservasService,sessionService) {

    var vm = this;
    vm.getReservasHoy = getReservasHoy;
    vm.finanzas = {};
    vm.network = true;
   
    
     Date.prototype.toDateInputValue = (function () {
            var local = new Date(this);
            local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
    });
    function getReservasHoy(){
               var fecha = new Date().toDateInputValue();
                  var promisePost = reservasService.getByFechaAll(sessionService.getIdSitio(), fecha);
                        promisePost.then(function (d) {
                            // google.charts.setOnLoadCallback(drawChart);
                            vm.finanzas.expectativa = parseInt(d.data.finanzas.posibleEntrada);
                            vm.finanzas.realidad = parseInt(d.data.finanzas.dineroEntrante);
                            vm.finanzas.abonos = parseInt(d.data.finanzas.abonos);
                            if (d.data.length === 0) {
                                message("No hay reservas : " + fecha);
                                 vm.reservas = d.data.reservas;
                                  vm.finanzas.expectativa = 0;
                                   vm.finanzas.realidad = 0;
                            } else {
                               vm.reservas = d.data.reservas;
                            }
                        }, function (err) {
                            console.log(err)
                            if (err.status == 401) {
                                message(err.data.respuesta);
                            } else {
                                message("Ha ocurrido un problema!");
                            }
                    });
              }

        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
      getReservasHoy();
    }
})();



