(function () {
    'use strict';
    angular.module('historial', [])
            .config(function ($stateProvider) {
                $stateProvider
                        .state('usuario.historial', {
                            url: '/historial',
                            templateUrl: 'app/historial/historial.html',
                            controller: 'historialCtrl as vm'
                        })
            });
})();
(function () {
    'use strict';

    angular
            .module('historial')
            .controller('historialCtrl', HistorialCtrl);
    /* @ngInject */
    function HistorialCtrl($ionicLoading, $scope, $ionicModal, reservasService, sessionService, clienteService) {
        var vm = this;
        vm.finanzas = {};
        vm.estadisticasReservas = {};
        vm.fecha1 = new Date();
        vm.fecha2 = new Date();
        vm.getReservas = getReservas;
        vm.openModal = openModal;
        vm.closeModal = closeModal;
        vm.closeModalReserva = closeModalReserva;
        vm.viewReserva = viewReserva;
        vm.v_reserva = {};
        vm.v_estadisticas = {};
        $ionicModal.fromTemplateUrl('modalReservas.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $ionicModal.fromTemplateUrl('reserva.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalReserva = modal;
        });


        function openModal() {
            $scope.modal.show();
        };


        function closeModal() {
            $scope.modal.hide();
        };
        function closeModalReserva() {
            $scope.modalReserva.hide();
        };
        Date.prototype.toDateInputValue = (function () {
            var local = new Date(this);
            local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
        });

        function drawChart() {
            // Create the data table.
            vm.estadisticasReservas.incumplidas = 0;
            vm.estadisticasReservas.canceladas = 0;
            vm.estadisticasReservas.cumplidas = 0;
            vm.estadisticasReservas.espera = 0;

            var promisePost = reservasService.getEstadisticasByFecha(sessionService.getIdSitio(), vm.fecha1.toDateInputValue(), vm.fecha2.toDateInputValue());
            promisePost.then(function (d) {
                var i = 0;
                for (i = 0; i < d.data.reservas.length; i++) {
                    if (d.data.reservas[i].estado === 'confirmadasinabono' || d.data.reservas[i].estado === 'confirmadaconabono') {
                        vm.estadisticasReservas.espera += parseInt(d.data.reservas[i].cantidad);
                    }
                    if (d.data.reservas[i].estado === 'cumplida') {
                        vm.estadisticasReservas.cumplidas = parseInt(d.data.reservas[i].cantidad);
                    }
                    if (d.data.reservas[i].estado === 'incumplida') {
                        vm.estadisticasReservas.incumplidas = parseInt(d.data.reservas[i].cantidad);
                    }
                    if (d.data.reservas[i].estado === 'cancelada') {
                        vm.estadisticasReservas.canceladas = parseInt(d.data.reservas[i].cantidad);
                    }
                }
            }, function (err) {
                if (err.status == 401) {
                    message(err.data.respuesta);
                } else {
                    message("Ha ocurrido un problema!");
                }
            });
        }

        function getReservas() {
            var promisePost = reservasService.getHistorial(sessionService.getIdSitio(), vm.fecha1.toDateInputValue(), vm.fecha2.toDateInputValue());
            promisePost.then(function (d) {
                vm.reservas = d.data.reservas;
                drawChart();
                vm.finanzas.expectativa = parseInt(d.data.finanzas.posibleEntrada);
                vm.finanzas.realidad = parseInt(d.data.finanzas.dineroEntrante);
                vm.finanzas.abonos = parseInt(d.data.finanzas.abonos);

            }, function (err) {
                if (err.status == 401) {
                    message(err.data.respuesta);
                } else {
                    message("Ha ocurrido un problema!");
                }
            });
        }

        getReservas();

        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }

        function viewReserva(reserva) {
            vm.v_reserva = reserva;
            vm.v_estadisticas.cumplidas = 0;
            vm.v_estadisticas.incumplidas = 0;
            vm.v_estadisticas.canceladas = 0;

            var promisePost = clienteService.get(reserva.idCliente);
            promisePost.then(function (d) {
                vm.v_cliente = d.data.cliente;
                  $scope.modalReserva.show();
                for (var i = 0; i < d.data.reservas.length; i++) {
                    if (d.data.reservas[i].estado === 'cumplida') {
                        vm.v_estadisticas.cumplidas = d.data.reservas[i].cantidad;
                    }
                    if (d.data.reservas[i].estado === 'incumplida') {
                        vm.v_estadisticas.incumplidas = d.data.reservas[i].cantidad;
                    }
                    if (d.data.reservas[i].estado === 'cancelada') {
                        vm.v_estadisticas.canceladas = d.data.reservas[i].cantidad;
                    }
                }

            }, function (err) {
                if (err.status == 401) {
                    message(err.data.respuesta);
                } else {
                    message("Ha ocurrido un problema!");
                }
            });

          
        }

    }
})();

