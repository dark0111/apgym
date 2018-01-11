angular.module('SumoSurvey')
	.controller('AdminController', ['AdminService', 'GymService', '$location','$filter',
		function (AdminService, GymService, $location,$filter) {
			var adminVm = this;

			adminVm.currentPage = 1;
			adminVm.numberOfPages = 1;
			adminVm.pages = [1];

            adminVm.gyms = [];
            adminVm.questions = [];
			adminVm.totalAnswers = 0;

			function setupGyms() {
				GymService.getGyms(adminVm.currentPage, function (gyms) {
					adminVm.gyms = gyms.slice();
					
                });
                GymService.getQuestions(adminVm.currentPage, function (questions) {
                    adminVm.questions = questions.slice();  
                });
			}

			if (!AdminService.LoggedIn()) {
				$location.url('/admin/login');
			} else {
				GymService.getGymCount(function (count) {
					adminVm.numberOfPages = Math.ceil(count / 10);
					adminVm.pages = Array.apply(null, Array(adminVm.numberOfPages)).map(function (_, i) { return i + 1; });
				});
				setupGyms();
			}

			adminVm.goToPrevPage = function () {
				if (adminVm.currentPage > 1) {
					adminVm.currentPage--;
					setupGyms();
				}
			};
			adminVm.goToNextPage = function () {
				if (adminVm.currentPage + 1 <= adminVm.numberOfPages) {
					adminVm.currentPage++;
					setupGyms();
				}
			};
			adminVm.goToPage = function (page) {
				if (page <= adminVm.numberOfPages && page !== adminVm.currentPage) {
					adminVm.currentPage = page;
					setupGyms();
				}
			};

			adminVm.newGym = function () {
				AdminService.setCurrentGym(null);
				$location.url('/admin/form');
			};

            var resultsActive = {};
            var resultsStatus = {};
			adminVm.toggleResults = function (id) {
				if (resultsActive[id] === undefined) {
					resultsActive[id] = true;
				} else {
					resultsActive[id] = !resultsActive[id];
				}
			};
			adminVm.collapseResultsClass = function (id) {
				return resultsActive[id] ? '' : 'collapse';
			};
			adminVm.activeButtonClass = function (id) {
				return resultsActive[id] ? 'active' : '';
            };
            adminVm.exportGym = function () {
                //alert('I am developing now. it will be done soon.')
                //$location.url('/excelexport/admin');
                location.href='/exportexcel';
                //$location.path('/exportexcel');  
			};
            adminVm.statusUpdate = function (gym) {              
                
                if (confirm("Do you want to chage the status of Gym?"))
                {
                    
                   gym.gym_date=$filter('date')(gym.gym_date, "yyyy-MM-dd");
                   //alert(gym.id+"/"+gym.gym_stat+"/"+gym.gym_date)
                   GymService.updateOrCreateGym(gym, function () {
                        $location.url('/admin/list');
                    });
                    //GymService.updateOrCreateGym(gym, function () {
                        //$location.url('/admin/list');
                    //});
                    AdminService.setCurrentGym(gym);
				    //$location.url('/admin/form');
                }
				return resultsStatus[gym] ? 'active' : '';
			};

			adminVm.editGym = function (gym) {
                gym.gym_date=$filter('date')(gym.gym_date, "yyyy-MM-dd");
                AdminService.setCurrentGym(gym);
                
				$location.url('/admin/form');
			};

			adminVm.deleteGym = function (gym) {
				if (confirm('Are you sure you want to delete this Gym Question?-')) {
					GymService.deleteGym(gym, function () {
						adminVm.gyms.splice(adminVm.gyms.indexOf(gym), 1);
						GymService.getGymCount(function (count) {
							adminVm.numberOfPages = Math.ceil(count / 10);
							adminVm.pages = Array.apply(null, Array(adminVm.numberOfPages)).map(function (_, i) { return i + 1; });
						});
						setupGyms();
					});
				}
			};

		}]);
