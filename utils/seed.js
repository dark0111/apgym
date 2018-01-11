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
var Feedback = models.Feedback;
var Speaker = models.Speaker;
var User = models.User;

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

    if (questionCount === 0) {
      addQuestions();
    }
  });
  Gym.count().then(function (gymCount) {
    
    if (gymCount === 0) {
      addGyms();
    }
  });
  Speaker.count().then(function (speakerCount) {

    if (speakerCount === 0) {
      addSpeakers();
    }
  });
  Feedback.count().then(function (feedbackCount) {
    if (feedbackCount === 0) {
      addFeedbacks();
    }
  });
  User.count().then(function (userCount) {
    if (userCount === 0) {
      addUsers();
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

function addSpeakers() {
    seedDatagym.speakers.forEach(function (speakerToCreate) {
      Speaker.create({
        speaker_w3_id:speakerToCreate.speaker_w3_id,
        speaker_gym:speakerToCreate.speaker_gym,
        speaker_name:speakerToCreate.speaker_name,
        speaker_market:speakerToCreate.speaker_market,
        speaker_location:speakerToCreate.speaker_location,
        speaker_account:speakerToCreate.speaker_account,
        speaker_client_background:speakerToCreate.speaker_client_background,
        speaker_sales_journey:speakerToCreate.speaker_sales_journey,
        speaker_cloud_pattern:speakerToCreate.speaker_cloud_pattern,
        speaker_cloud_type:speakerToCreate.speaker_cloud_type,
        speaker_key_message:speakerToCreate.speaker_key_message,
        speaker_client_role:speakerToCreate.speaker_client_role,
        speaker_reg_date:speakerToCreate.speaker_reg_date
      }).then(function (createdSpeaker) {
        debug('Seed Speaker Created.');
      });
    });
}
function addUsers() {
    seedDatagym.users.forEach(function (userToCreate) {
      User.create({
        user_w3_id:userToCreate.user_w3_id,
        username:userToCreate.username,
        user_call:userToCreate.user_call
      }).then(function (createduser) {
        debug('Seed user Created.');
      });
    });
}
function addFeedbacks() {
    seedDatagym.feedbacks.forEach(function (feedbackToCreate) {
      Feedback.create({
        feedback_date: feedbackToCreate.feedback_date,
        rating1:feedbackToCreate.rating1,
        rating2:feedbackToCreate.rating2,
        rating3:feedbackToCreate.rating3,
        rating4:feedbackToCreate.rating4,
        rating5:feedbackToCreate.rating5,
        rating6:feedbackToCreate.rating6,
        rating7:feedbackToCreate.rating7,
        rating8:feedbackToCreate.rating8,
        rating9:feedbackToCreate.rating9,
        rating10:feedbackToCreate.rating10,
        comment1:feedbackToCreate.comment1,
        GymId:feedbackToCreate.GymId,
        SpeakerId:feedbackToCreate.SpeakerId,
        feedback_user:feedbackToCreate.feedback_user
      }).then(function (createdFeedback) {
        debug('Seed feedback Created.');
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
