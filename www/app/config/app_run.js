 (function() {
        'use strict';

        angular.module('app').run(appRun);    
        function appRun($ionicPlatform,$state,authService, HOME) {                       
            
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
    
             autenticate();
            });
            function autenticate(){
               if(authService.currentUser() !== null) {
                   authService.autologin().then(function (res) {
                       hideSplash();
                       if (res) {
                            $state.go(HOME);
                       }else{
                           $state.go('login');
                       }
                   });
               }else{
                   $state.go('login');
               }
            }
            
           
            
            function hideSplash() {
                if(navigator.splashscreen){
                    setTimeout(function () {
                        navigator.splashscreen.hide();
                    }, 1000);
                }
            }
            

         
        }
         })();


