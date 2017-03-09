(function () {
    'use strict';
    angular
            .module('auth')
            .controller('registroCtrl', registroCtrl);

    /* @ngInject */

    function registroCtrl($ionicLoading,$ionicPopup,authService) {
   
           var vm = this;
           vm.usuario = {};
           vm.oculto = false;
           vm.registro = registro;
           
   
    
   function registro(){
       
      if(vm.usuario.nombres === undefined || vm.usuario.nombres === ""){
          message("Por favor ingresar nombres");
          return false;
      }
      if(vm.usuario.apellidos === undefined || vm.usuario.apellidos === ""){
          message("Por favor ingresar apellidos");
          return false;
      }
      if(vm.usuario.cedula === undefined || vm.usuario.cedula === ""){
          message("Por favor ingresar cedula");
  
          return false;
      }
       if(vm.usuario.correositio === undefined || vm.usuario.correositio === ""){
          message("Por favor ingresar el correo de su sitio");
          return false;
      }
      if(vm.usuario.passwordsitio === undefined || vm.usuario.passwordsitio === ""){
          message("Por favor ingresar el la contraseña de su sitio");
  
          return false;
      }
      if(vm.usuario.correo === undefined || vm.usuario.correo === ""){
          message("Por favor ingresar su correo personal");
          return false;
      }
      if(vm.usuario.password === undefined || vm.usuario.password === ""){
          message("Por favor ingresar contraseña");
          return false;
      }
      if(vm.usuario.password !== vm.usuario.passwordconfirmada){
          message("sus contraseñas ingresadas no coinciden");
          vm.oculto = false;
          return false;
      }
            vm.oculto = true;
            $ionicLoading.show();
            authService.registro(vm.usuario).then(success, error);
            function success(d) {
                if(d.data.respuesta === true){
                    alert("Mensaje",d.data.message);
                    vm.usuario = {};
                    vm.oculto = false;
                    $ionicLoading.hide();
                }
                if(d.data.respuesta === false){
                   alert("Mensaje",d.data.message); 
                   vm.oculto = false;
                   $ionicLoading.hide();
                }
            }
            function error(error) {
                 vm.oculto = false;
                $ionicLoading.hide();
                message("Ha ocurrido un problema, intentalo de nuevo.");
            }
    };
 
    function alert(title,msg){
        var alertPopup = $ionicPopup.alert({
        title: title,
        template: msg
      });

      alertPopup.then(function(res) {
        console.log('Entendido');
      });
 };
    
     function message(msg) {
            $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
       }
    }
})();






