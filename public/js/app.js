
'use strict';

var checkLoggedin = ['$q', '$http', '$location', 'AdminService',
  function ($q, $http, $location, AdminService) {
    // Initialize a new promise
    var deferred = $q.defer();

    // Make an AJAX call to check if the user is logged in
    $http.get('/api/loggedin').success(function (response) {
      // Authenticated
      if (response.authenticated) {
        AdminService.setLoggedIn(true);
        deferred.resolve();
      }

      // Not Authenticated
      else {
        AdminService.setUrlAfterLogin($location.url());
        deferred.reject();
        $location.url('/admin/login');
      }
    }).error(function (err) {
      AdminService.setUrlAfterLogin($location.url());
      deferred.reject();
      $location.url('/admin/login');
    });

    return deferred.promise;
  }];

angular.module('SumoSurvey', [
  'ngRoute',
  'ngTouch',
  'restangular'
])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', 'RestangularProvider',
    function ($routeProvider, $locationProvider, $httpProvider, RestangularProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'partials/survey.html'
        })
        .when('/admin/login', {
          templateUrl: 'partials/login.html'
        })
        .when('/admin/list', {
            templateUrl: 'partials/gymlist.html',
            resolve: {
              loggedIn: checkLoggedin
            }
          })
        .when('/excelexport/admin', {
           
          })
        .when('/admin/form/:gym_id?', {
            templateUrl: 'partials/form.html',
            resolve: {
              loggedIn: checkLoggedin
            }
          })
        .otherwise({
          redirectTo: '/'
        });

      $locationProvider.html5Mode(true);

      RestangularProvider.setBaseUrl('/api/');
      RestangularProvider.setDefaultHeaders($httpProvider.defaults.headers);
      RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
        if (response.status === 401) {
          if (operation === 'getList') {
            return [];
          }
        }
        return data;
      });
    }]);