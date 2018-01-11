// Load required packages
var bcrypt = require('bcrypt');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2').Strategy;
var User = require('../models').User;

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://w3id.alpha.sso.ibm.com/isam/oidc/endpoint/amapp-runtime-oidcidp/authorize',
    tokenURL: 'https://w3id.alpha.sso.ibm.com/isam/oidc/endpoint/amapp-runtime-oidcidp/token',
    clientID: 'YjhkZmQ0M2MtMTI4YS00',
    clientSecret: 'MzMzMWFiYzgtNzhjNy00',
    callbackURL: "https://10.10.14.216:4000/auth/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ user_w3_id: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


