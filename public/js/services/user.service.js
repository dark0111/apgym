angular.module('SumoSurvey')
	.factory('UserService', ['Restangular', '$location',
		function (Restangular, $location) {
			var UserService = {};

			var urlAfterLogin = '/list';
			var loggedIn = false;
			var currentGym = null;
            var currentQuestion = null;

			UserService.LoggedIn = function () {
				return loggedIn;
			};
			UserService.setLoggedIn = function (value) {
				loggedIn = value;
			};

			UserService.LogIn = function (username, password, cb) {
				Restangular.all('user').doPOST({
					username: username,
					password: password
				}, 'login').then(function (message) {
					console.log('Success: ' + message);
					loggedIn = true;
					if (cb) cb(true);
					else $location.url(urlAfterLogin);
				}, function (err) {
					console.log('Error: ' + err);
					loggedIn = false;
					if (cb) cb(false);
				});
			};

			UserService.LogOut = function (cb) {
				Restangular.all('user').doPOST({}, 'logout').then(function (message) {
					console.log('Success: ' + message);
					loggedIn = false;
					if (cb) cb(false);
					else $location.url(urlAfterLogin);
				}, function (err) {
					console.log('Error: ' + err);
					loggedIn = false;
					if (cb) cb(false);
				});
			};

			UserService.setUrlAfterLogin = function (url) {
				urlAfterLogin = url;
			};
			UserService.getUrlAfterLogin = function () {
				return urlAfterLogin;
			}

			UserService.setCurrentGym = function (gym) {
				currentGym = gym;
            };
            UserService.getCurrentGym = function () {
				return currentGym;
			}
        
			

			return UserService;
		}]);
