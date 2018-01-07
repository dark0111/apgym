angular.module('SumoSurvey')
	.factory('GymService', ['Restangular',
		function (Restangular) {
			var GymService = {};

			GymService.getRandomGym = function (cb) {
				Restangular.all('gyms').doGET('random')
					.then(function (gym) {
						if (cb) cb(gym);
					}, function (response) {
						console.log('Error: ' + response);
					});
			};

			GymService.getGyms = function (page, cb) {
				page = page || 1;
				Restangular.all('gyms').getList({ page: page,orderBy:'gym_date' })
					.then(function (gyms) {
						if (cb) cb(gyms);
					}, function (response) {
						console.log('Error: ' + response);
					});
            };
            GymService.getQuestions = function (page, cb) {
				page = page || 1;
				Restangular.all('gyms/questions/1').getList({ page: page})
					.then(function (questions) {
						if (cb) cb(questions);
					}, function (response) {
						console.log('Error: ' + response);
					});
			};

			GymService.getGymCount = function (cb) {
				Restangular.all('gyms').doGET('count').then(function (res) {
					if (cb) cb(res.count);
				});
			}

			GymService.updateOrCreateGym = function (gym, cb) {
                var promise;

				if (gym.id && gym.save) {
                    console.log('222333')
                    console.log(gym.gym_stat)
                    console.log(gym.gym_date)
					promise = gym.save();
				} else if (gym.id) {                    
					promise = Restangular.one('gyms', gym.id).put(gym);
				} else {
					promise = Restangular.all('gyms').post(gym);
				}
				promise.then(function () {
					if (cb) cb();
				});
			};

			GymService.deleteGym = function (gym, cb) {
                var promise;
                console.log('1111')
				if (gym.remove) {
                    console.log('222')
                    console.log(gym)
					promise = gym.remove();
				} else {
                    console.log('333')
                    console.log(gym.id)
					promise = Restangular.one('gyms', gym.id).remove();
				}
				promise.then(function () {
                    console.log('333-222')
					if (cb) cb();
				});
			};

			return GymService;
		}]);
