var Router = require('express').Router;
var debug = require('debug')('gymRouter');

var auth = require('../utils/auth');
var models = require('../models');
var Gym = models.Gym;
var Question = models.Question;


var router = new Router();

router
  .get('', auth.isAuthenticated, function (req, res) {
    var maxPerPage = 10;
    var page = req.query.page || 0;
    page = page === 0 ? 0 : page - 1;
    Gym.findAll({
      offset: page * maxPerPage,
      limit: maxPerPage,
      order: [
        ['gym_date', 'DESC'] ]
    }).then(function (gyms) {
      res.json(gyms);
    });
  })
  .post('', auth.isAuthenticated, function (req, res) {
    if (!req.body.gym_location ) {
      res.json({ message: 'Invalid body' });
      return;
    }
    Gym.create({
      gym_location: req.body.gym_location,
      gym_date: req.body.gym_date,
      gym_market: req.body.gym_market,
      gym_description: req.body.gym_description,
      gym_questionGroup:1,
    }).then(function (gym) {
        res.json({ message: 'Success!' });
    });
  })
  .get('/count', auth.isAuthenticated, function (req, res) {
    Gym.count().then(function (gymCount) {
      res.json({ count: gymCount });
    });
  })
  .get('/questions/:questionGroup_id', auth.isAuthenticated, function (req, res) {
    
    Question.findAll({
        where: { question_group: req.params.questionGroup_id }
    }).then(function (questions) {
        //console.log(questions)
        res.json(questions);
    });
  })
  .get('/random', function (req, res) {
    var gymsAnswered = req.session.gymsAnswered ?
      req.session.gymsAnswered.map(function (x) { return parseInt(x); }) : [];
    Gym.findAll({
      
    }).then(function (gyms) {
      var unansweredGyms = gyms.filter(function (gym) {
        console.log(gymsAnswered);
        return !gymsAnswered.some(function (gym_id) {
          return gym.id === gym_id;
        });
      });
      debug('qUnanswered: ' + unansweredGyms);
      var randomIdx = Math.round((Math.random() * (unansweredGyms.length - 1)));
      debug('randomIdx: ' + randomIdx);
      res.json(unansweredGyms[randomIdx]);
    });
  })
  .get('/:gym_id', auth.isAuthenticated, function (req, res) {
    Gym.find({
      where: { id: req.params.gym_id }
    }).then(function (gym) {
      res.json(gym);
    });
  })
  .put('/:gym_id', auth.isAuthenticated, function (req, res) {

    Gym.find({
      where: { id: req.params.gym_id }
    }).then(function (gym) {
      if (!gym) {
        res.json({ message: 'Gym does not exist.' });
        return;
      }
      if (req.body.gym_location) {
        gym.updateAttributes({ 
            gym_location: req.body.gym_location,
            gym_date: req.body.gym_date,
            gym_market: req.body.gym_market,
            gym_description: req.body.gym_description,
            gym_questionGroup:1,
            gym_stat: req.body.gym_stat
         });
      }
      res.json({ message: 'Success!' });
    });
  })
  .delete('/:gym_id', auth.isAuthenticated, function (req, res) {
    console.log(req.params.gym_id)
    Gym.find({
      where: { id: req.params.gym_id }
    }).then(function (gym) {
        gym.destroy().then(function () {
          res.json({ message: 'Success!' });
      });
    });
  });

module.exports = router;
