angular.module('SumoSurvey')
	.controller('GymController', ['GymService',
		function (GymService) {
			var gymVm = this;
			gymVm.currentQuestion = {};


			var fetchGym = function () {
				GymService.getRandomGym(function (gym) {
					gymVm.currentQuestion = gym;
				});
			};
			fetchGym();

			//gymVm.submitAnswer = function (questionAnswered, answer) {
				//OptionService.answerOption(answer, fetchSurvey);
			//};
		}]);
