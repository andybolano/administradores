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
    function HomeCtrl($ionicLoading, $q, $timeout,$scope,reservasService,sessionService) {

    var vm = this;
    vm.getReservasHoy = getReservasHoy;
    vm.finanzas = {};
    vm.estadisticasReservas = {};
    vm.network = true;
   
    
     Date.prototype.toDateInputValue = (function () {
            var local = new Date(this);
            local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
    });
    
    function drawChart(){
   // Create the data table.
   vm.estadisticasReservas.incumplidas = 0;
   vm.estadisticasReservas.canceladas = 0;
   vm.estadisticasReservas.cumplidas = 0;
  vm.estadisticasReservas.espera = 0;
   var fecha = new Date().toDateInputValue();
                  var promisePost = reservasService.getEstadisticasByFecha(sessionService.getIdSitio(), fecha, fecha);
                        promisePost.then(function (d) {
                            var i=0;
                            for(i=0; i<d.data.reservas.length; i++){
                                if(d.data.reservas[i].estado ==='confirmadasinabono' || d.data.reservas[i].estado ==='confirmadaconabono'){
                                    vm.estadisticasReservas.espera += parseInt(d.data.reservas[i].cantidad);
                                }
                                if(d.data.reservas[i].estado ==='cumplida' ){
                                    vm.estadisticasReservas.cumplidas = parseInt(d.data.reservas[i].cantidad);
                                }
                                if(d.data.reservas[i].estado ==='incumplida' ){
                                    vm.estadisticasReservas.incumplidas = parseInt(d.data.reservas[i].cantidad);
                                }
                                if(d.data.reservas[i].estado ==='cancelada' ){
                                    vm.estadisticasReservas.canceladas = parseInt(d.data.reservas[i].cantidad);
                                }
                            }
                        }, function (err) {
                            if (err.status == 401) {
                                toastr["error"](err.data.respuesta);
                            } else {
                                toastr["error"]("Ha ocurrido un problema!");
                            }
                    });
}
    function getReservasHoy(){
               var fecha = new Date().toDateInputValue();
                  var promisePost = reservasService.getByFechaAll(sessionService.getIdSitio(), fecha);
                        promisePost.then(function (d) {
                            
                          drawChart();
                          
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
                    }).finally(function () {
                        $scope.$broadcast('scroll.refreshComplete');
                    });
              }

        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
      getReservasHoy();
    }
})();



