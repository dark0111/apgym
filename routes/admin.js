var Router = require('express').Router;
var passport = require('passport');
var debug = require('debug')('adminRouter');


var router = new Router();

router
	.post('/admin/login', passport.authenticate('local'), function (req, res) {
		debug('Authenticated!');
		debug(req.session);
		res.send(req.user);
	})
	.post('/admin/logout', function (req, res) {
		req.logOut();
		res.sendStatus(200);
    });
module.exports = router;
