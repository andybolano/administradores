(function () {
    'use strict';
    angular
            .module('auth')
            .controller('registroCtrl', registroCtrl);

    /* @ngInject */

    function registroCtrl($scope, $ionicLoading, API_URL,$http,authService) {
    $scope.$on('$ionicView.loaded', function () {
            $scope.Departamentos = [];
            $scope.Municipios = [];
            $scope.Cliente = [];
            $scope.active = "";
            $scope.valUser = false;    
            $scope.valEmail = false;
            $scope.valCedula = false;
            $scope.loadDepartamentos();    
            initialize(); 
    });
    
      function initialize() {                        
        $scope.Cliente = {
            nombres: "",
            apellidos: "",
            idMunicipio: "",
            idDepartamento: "",
            direccion: "",
            telefono: "",
            correo: "",
            cedula: "",
            fechaNacimiento: new Date()
        };
         $scope.Departamentos = [];
         $scope.Municipios = [];
    };
    
     $scope.loadDepartamentos = function() {
      $http.get(API_URL+'departamento').success(function (pl) {
          $scope.Departamentos = pl;
      });
    };
    
     $scope.loadMunicipios = function() {
      $http.get(API_URL+'departamento/'+ $scope.Cliente.idDepartamento +'/municipios').success(function (pl) {
          $scope.Municipios = pl;
      });
    };
    
     $scope.validarCedula = function () {
        $scope.valCedula = false;
        if (!$scope.Cliente.cedula) {
            return;
        }        
        $http.get(API_URL+'cliente/' + $scope.Cliente.cedula +'/validarcc').success(function (pl) {
           if (pl.cedula) {
               $scope.Cliente.cedula = "";
                $scope.valCedula = true;
                message("Su cedula ya se encuentra registrada en el sistema.");
            }
      });
        
    };
    
     $scope.validarEmail = function () {
        $scope.valEmail = false;
        if (!$scope.Cliente.correo) {
            return;
        }  
        $http.get(API_URL+'cliente/' + $scope.Cliente.correo.toUpperCase()+'/validar').success(function (pl) {
            if (pl.correo) {
                $scope.valEmail = true;
                $scope.Cliente.correo = ""
                   message("El email ingresado ya se encuentra registrado en el sistema.");
               
            }
      });
  }
       $scope.validarUser = function () {
        if (!$scope.Cliente.username) {
            return;
        }
        $scope.valUser = false;
       $http.get(API_URL+'usuario/' + $scope.Cliente.username.toUpperCase() +'/validar').success(function (pl) {
           if (pl.login) {
               $scope.Cliente.username = "";
              $scope.valUser = true;
              message("Nombre de usuario ya está en uso.");
          }
       });
      
    };
    
    $scope.registro = function(){

          if ($scope.valCedula) {
            message("Su cedula ya se encuentra registrada en el sistema.");
            return;
        }
        
        if ($scope.valUser) {
            message("Nombre de usuario ya está en uso.");
            return;
        }
        
        if ($scope.valEmail) {
           message("El email ingresado ya se encuentra registrado en el sistema.");
            return;
        }
        $scope.oculto = true;
        var fecha = new Date($scope.Cliente.fechaNacimiento);
        var direccion = ($scope.Cliente.direccion) ? $scope.Cliente.direccion.toUpperCase() : "";
        var ObjPermiso = [{ "idPermiso": 20}];
        var object = {
            nombres: $scope.Cliente.nombres.toUpperCase(),
            apellidos: $scope.Cliente.apellidos.toUpperCase(),
            idMunicipio: $scope.Cliente.idMunicipio,
            idDepartamento: $scope.Cliente.idDepartamento,
            cedula: $scope.Cliente.cedula,
            direccion: direccion,
            telefono: $scope.Cliente.telefono,
            correo: $scope.Cliente.correo.toUpperCase(),
            login: $scope.Cliente.username.toUpperCase(),
            clave: $scope.Cliente.clave.toUpperCase(),
            permisos: ObjPermiso,
            fechaNacimiento: fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate()
        };
     var idClienteN="";
     
     
             $ionicLoading.show();
            authService.registro(object).then(success, error);
            function success(d) { 
                 $scope.oculto = false;
               idClienteN = d.data.request;
                message(d.data.message);
                var objectEmail = {
                    id:idClienteN,
                    user: $scope.Cliente.username.toUpperCase(),
                    clave: $scope.Cliente.clave.toUpperCase()
                };     
                
                 $scope.Cliente = "";
                 authService.enviarEmail(objectEmail).then(success, error);
                function success(d) { 
                    message("Se ha enviado un mensaje a tu correo para confirmar la cuenta");                    
                    initialize();
                } function error(error) {
                     $scope.oculto = false;
                    message("Hemos tenido problemas al enviar emial de confirmación.");
                    console.log("Some Error Occured " + JSON.stringify(error));
                }
   
            }
            function error(error) {
                 $scope.oculto = false;
                $ionicLoading.hide();
                message("Verifica tu conexión");
            }
           
    
    };
 

       
        
        function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
        }
        
       
    }
})();






