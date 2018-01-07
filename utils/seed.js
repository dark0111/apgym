var bcrypt = require('bcrypt');
var debug = require('debug')('seed');
var seedData = require('../seed.json');
var seedDatagym = require('../seedgym.json');

var models = require('../models');
var Admin = models.Admin;
var Survey = models.Survey;
var Option = models.Option;
var Question = models.Question;
var Gym = models.Gym;

module.exports = function seed() {
  debug('Seeding Admin Password');
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(seedData.admin_password, salt, function(err, hash) {
      Admin.findOrCreate({
        where: { username: 'YJH' },
        defaults: {
          username: 'YJH',
          password: hash
        }
      }).spread(function (admin, created) {
        if (!created) {
          admin.updateAttributes({ password: hash });
        }
      });
    });
  });

  debug('Seeding Survey Data');
  Survey.count().then(function (surveyCount) {
    debug('Survey Count: ' + surveyCount);
    if (surveyCount === 0) {
      addSurveys();
    }
  });

//for jh ##############################################
  debug('Seeding Question Data');
  Question.count().then(function (questionCount) {
    debug('Question Count: ' + questionCount);
    if (questionCount === 0) {
      addQuestions();
    }
  });
  Gym.count().then(function (gymCount) {
    debug('Gym Count: ' + gymCount);
    if (gymCount === 0) {
      addGyms();
    }
  });
}

function addQuestions() {
    seedDatagym.questions.forEach(function (questionToCreate) {
      Question.create({
        question_text: questionToCreate.question_text,
        question_type: questionToCreate.question_type,
        question_group:  questionToCreate.question_group,
        question_order:  questionToCreate.question_order
      }).then(function (createdQuestion) {
        debug('Seed Question Created.');
      });
    });
}
function addGyms() {
    seedDatagym.gyms.forEach(function (gymToCreate) {
      Gym.create({
        gym_title: gymToCreate.gym_title,
        gym_market: gymToCreate.gym_market,
        gym_location:  gymToCreate.gym_location,
        gym_description:gymToCreate.gym_description,
        gym_date:gymToCreate.gym_date,
        gym_questionGroup:gymToCreate.gym_questionGroup,
        gym_stat:gymToCreate.gym_stat
      }).then(function (createdGym) {
        debug('Seed gym Created.');
      });
    });
}
//end jh ##################################################

function addSurveys() {
  seedData.surveys.forEach(function (surveyToCreate) {
    Survey.create({
      question_text: surveyToCreate.question_text
    }).then(function (createdSurvey) {
      debug('Creating surveys...');
      surveyToCreate.options.forEach(function (optionText) {
        createOption(createdSurvey, optionText);
      });
    });
  });
}

function createOption(survey, optionText) {
  Option.create({
    text: optionText,
    answer_count: 0
  }).then(function (createdOption) {
    createdOption.setSurvey(survey).then(function () {
      debug('Seed Survey Question Created.');
    });
  });
}
