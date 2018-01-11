angular.module('SumoSurvey')
	.controller('NavController', ['AdminService','UserService', '$location',
		function (AdminService,UserService, $location) {
			var navVm = this;

			navVm.AdminLoggedIn = AdminService.LoggedIn;
			navVm.AdminLogIn = function () {
				$location.url('/admin/login');
			}
			navVm.AdminLogOut = function () {
				AdminService.LogOut(function () {
                    
					$location.url('/admin/login');
				});
            }
            
            navVm.UserLoggedIn = UserService.LoggedIn;
			navVm.UserLogIn = function () {
				$location.url('/login');
			}
			navVm.UserLogOut = function () {
				UserService.LogOut(function () {
                    
					$location.url('/login');
				});
			}
		}]);
