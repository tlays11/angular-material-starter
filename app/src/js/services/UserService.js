'use strict';

/**
 * Users DataService
 *
 * @returns {{loadAll: Function}}
 * @constructor
 */
var UserService = function($q){
  var users = [
    {
      name: 'Tim Dunder',
      email: 'tim@dunder.com',
      title: 'Developer'
    }
  ];

  // Promise-based API
  return {
    loadAll : function() {
      // Simulate async nature of real remote calls
      return $q.when(users);
    }
  };
};

angular
      .module('ttstarter.services')
      .service('UserService', ['$q', UserService]);
