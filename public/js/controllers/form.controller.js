angular.module('SumoSurvey')
	.controller('FormController', ['AdminService', 'GymService', '$routeParams', '$location','$filter',
		function (AdminService, GymService, $routeParams, $location,$filter) {
			var formVm = this;

			if (!AdminService.LoggedIn()) {
				$location.url('/admin/login');
			}
           
			formVm.gym = {
				gym_market: '',
                gym_location: '',
                gym_date: '',
                gym_description: '',
                gym_stat:'true'
            };
            formVm.questions=[];
            //formVm.questions = GymService.getQuestions()
            GymService.getQuestions(1,function (questions) {
                if (questions) {
                    formVm.questions = questions;
                }
            });
            
			if ($routeParams.gym_id) {
                console.log('666-222')
                GymService.getGym($routeParams.gym_id, function (gym) {
					if (gym) {
						formVm.gym = gym;
					}
				});
			} else {
             
				formVm.gym = AdminService.getCurrentGym() || {
					gym_market: '',
                    gym_location: '',
                    gym_date: '',
                    gym_description: '',
                    gym_stat:'true'
                };
                
                    
			}

			formVm.submitGym = function (gym) {
				GymService.updateOrCreateGym(gym, function () {
					$location.url('/admin/list');
				});
			};

			formVm.cancel = function() {
				formVm.gym = {
					gym_market: '',
                    gym_location: '',
                    gym_date: '',
                    gym_description: '',
                    gym_stat:'true'
				};
				$location.url('/admin/list');
            }
            
            $('.datepicker').datepicker({
                uiLibrary: 'bootstrap',
                format: 'yyyy-mm-dd',
                value: formVm.gym.gym_date,
                change: function (e) {
                    formVm.gym.gym_date=$('.datepicker').val();
                    console.log(JSON.stringify(e))
                    //console.log($filter('date')(e.timeStamp, "yyyy-MM-dd"));
                    //console.log()
                    //console.log(format(new Date(e.timeStamp), 'MM/dd/yyyy'));
                }
            });
		}]);
        var format = function (time, format) {
            var t = new Date(time);
            var tf = function (i) { return (i < 10 ? '0' : '') + i };
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                switch (a) {
                    case 'yyyy':
                        return tf(t.getFullYear());
                        break;
                    case 'MM':
                        return tf(t.getMonth() + 1);
                        break;
                    case 'mm':
                        return tf(t.getMinutes());
                        break;
                    case 'dd':
                        return tf(t.getDate());
                        break;
                    case 'HH':
                        return tf(t.getHours());
                        break;
                    case 'ss':
                        return tf(t.getSeconds());
                        break;
                }
            })
        }
 

          