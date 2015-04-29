'use strict';

angular.module('ttstarter.services',[]);
angular.module('ttstarter.controllers',[]);
angular.module('ttstarter.directives',[]);

angular
  .module('ttstarter', 
    ['ngMaterial',
     'ui.router',
     'ttstarter.services', 
     'ttstarter.controllers', 
     'ttstarter.directives'
    ]
  )
  .config(function($mdThemingProvider, $stateProvider, $locationProvider, $urlRouterProvider){

    // Material theme colors
    $mdThemingProvider
        .theme('default')
        .primaryPalette('indigo')
        .accentPalette('red');

    // Enable HTML 5 mode for url
    $locationProvider.html5Mode(true);

    // Define routes
    $stateProvider
      .state('dash', {
        url: '/dash',
        templateProvider: function($templateCache){  
          return $templateCache.get('dash.html'); 
        },
        controller: 'DashCtrl as ctrl'
      })
      
      .state('contacts', {
        url: '/contacts',
        templateProvider: function($templateCache){  
          return $templateCache.get('contacts.html'); 
        },
        controller: 'ContactsCtrl as ctrl'
      });

      // Fallthrough route
      $urlRouterProvider.otherwise('/dash');

  });

// Start it up when the page is ready
angular.element(document).ready(function() {
  angular.bootstrap(document, ['ttstarter']);
});