(function() {
    'use strict';
    angular
        .module('app')
        .config(config)
        .constant('API_URL', 'http://localhost/birrias/api/public/index.php/api');
            function config(API_URL, $httpProvider  ) {  
                
            }
})();
  


