angular.module('SumoSurvey')
	.factory('AdminService', ['Restangular', '$location',
		function (Restangular, $location) {
			var AdminService = {};

			var urlAfterLogin = '/admin/list';
			var loggedIn = false;
			var currentGym = null;
            var currentQuestion = null;

			AdminService.LoggedIn = function () {
				return loggedIn;
			};
			AdminService.setLoggedIn = function (value) {
				loggedIn = value;
			};

			AdminService.LogIn = function (username, password, cb) {
				Restangular.all('admin').doPOST({
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

			AdminService.LogOut = function (cb) {
				Restangular.all('admin').doPOST({}, 'logout').then(function (message) {
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

			AdminService.setUrlAfterLogin = function (url) {
				urlAfterLogin = url;
			};
			AdminService.getUrlAfterLogin = function () {
				return urlAfterLogin;
			}

			AdminService.setCurrentGym = function (gym) {
				currentGym = gym;
            };
            AdminService.getCurrentGym = function () {
				return currentGym;
			}
            /*
            AdminService.setQuestion = function (question) {
				currentQuestion = question;
            };
            AdminService.getQuestion = function () {
				return currentQuestion;
			};*/

			

			return AdminService;
		}]);
