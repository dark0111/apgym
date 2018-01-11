var path = require('path');
var logger = require('morgan');
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var debug = require('debug')('main');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

var routes = require('./routes');
//var auth = require('./utils/auth');
var authopenid = require('./utils/authopenid');
var sequelize = require('./utils/sequelize');
var mydb = require('./utils/dbconfig');
var seed = require('./utils/seed');
var models = require('./models'); // init sequelize models
const excel = require('node-excel-export');
var async = require('async');


sequelize.sync({ force: true }).then(function () {
  seed(); 
  var app = createServerApp();
  var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
  });
})

var Gym = models.Gym;
var Question = models.Question;

function createServerApp() {
  var app = express();

  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(session({
    secret: 'sumosecret',
    store: new SequelizeStore({
      db: sequelize,
      expiration: 1000 * 60 * 60 * 24 * 365 // the session will last a year in the db
    }),
    resave: false,
    saveUninitialized: true
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/api', routes);
  app.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    res.render('public/partials/' + name);
  });

  app.get('/admin', function (req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/admin/list');
      return;
    }
    res.redirect('/admin/login');
  });

  app.get('/admin/login', function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('/admin/list');
      return;
    }
    next();
  });

  //#######
  app.get('/', function (req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/admin/list');
      return;
    }
    res.redirect('/list');
  });
  app.get('/login/w3', function (req, res, next) {
    console.log('aaa')
    passport.authenticate('oauth2')
  });
  app.get('/auth/callback', passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('bbb')
    // Successful authentication, redirect home. 
    res.redirect('/');
  });

  app.get('/exportexcel',  function (req, res) {

    async.series([
        function(callback){
           mydb.getQuestion(1,function(err,questiondata){
            if (err) {
                console.log("ERROR : ",err);            
            } else {            
                callback(null,questiondata);
            }    
        });
        },
        function(callback){
            mydb.getGym(function(err,gymdata){
                if (err) {
                    console.log("ERROR : ",err);            
                } else {            
                    callback(null,gymdata);
                }    
            });
           
        },
        function(callback){
            mydb.getFeedback(function(err,feedbackdata){
                if (err) {
                    console.log("ERROR : ",err);            
                } else {            
                    callback(null,feedbackdata);
                }    
            });
           
        },
        function(callback){
            mydb.getSpeaker(function(err,speakerdata){
                if (err) {
                    console.log("ERROR : ",err);            
                } else {            
                    callback(null,speakerdata);
                }    
            });
           
        }
       ],
       function(err,results){
            if(err) console.log(err);
            //console.log(results)
            const styles = {
                headerDark: {
                    fill: {
                        fgColor: {
                        rgb: 'FF000000'
                        }
                    },
                    font: {
                        color: {
                        rgb: 'FFFFFFFF'
                        },
                        sz: 14,
                        bold: true,
                        underline: true
                    }
                },
                cellPink: {
                    fill: {
                        fgColor: {
                        rgb: 'FFFFCCFF'
                        }
                    }
                },
                cellGreen: {
                    fill: {
                        fgColor: {
                        rgb: 'FF00FF00'
                        }
                    }
                }
            };
            
            //Array of objects representing heading rows (very top)
            //const heading = [
            //    [{value: 'a1', style: styles.headerDark}, {value: 'b1', style: styles.headerDark}, {value: 'c1', style: styles.headerDark}],
            //    ['a2', 'b2', 'c2'] // <-- It can be only values
            //];
            
            //Here you specify the export structure
            var specification2 = {
                customer_name: { // <- the key should match the actual data key
                    displayName: 'Customer', // <- Here you specify the column header
                    headerStyle: styles.headerDark, // <- Header style
                    cellStyle: function(value, row) { // <- style renderer function
                        // if the status is 1 then color in green else color in red
                        // Notice how we use another cell value to style the current one
                        return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'ffffff'}}}; // <- Inline cell style is possible 
                    },
                    width: 120 // <- width in pixels
                },
                status_id: {
                    displayName: 'Status',
                    headerStyle: styles.headerDark,
                    cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
                        return (value == 1) ? 'Active' : 'Inactive';
                    },
                    width: '10' // <- width in chars (when the number is passed as string)
                },
                note: {
                    displayName: 'Description',
                    headerStyle: styles.headerDark,
                    cellStyle: styles.cellPink, // <- Cell style
                    width: 220 // <- width in pixels
                }
            }

            var specification2 = {
                speaker_email: { // <- the key should match the actual data key
                    displayName: 'Speaker Email id', // <- Here you specify the column header
                    headerStyle: styles.headerDark, // <- Header style
                    width: 120 // <- width in pixels
                },
                speaker_reg_date: {
                    displayName: 'Date Registered ',
                    headerStyle: styles.headerDark,
                    width: 110
                },
                speaker_market: {
                    displayName: 'Speaker Market',
                    headerStyle: styles.headerDark,
                    width: 110 
                },
                speaker_location: {
                    displayName: 'Speaker Location',
                    headerStyle: styles.headerDark,
                    width: 110 
                },
                speaker_account: {
                    displayName: 'Name of Account',
                    headerStyle: styles.headerDark,
                    width: 110 
                },
                speaker_client_background: {
                    displayName: 'Brief Client Background',
                    headerStyle: styles.headerDark,
                    width: 110 
                },
                speaker_sales_journey: {
                    displayName: 'Stage of Sales Journey',
                    headerStyle: styles.headerDark,
                    width: 110 
                },
                speaker_cloud_pattern: {
                    displayName: 'Cloud Pattern',
                    headerStyle: styles.headerDark,
                    width: 110 
                },
                speaker_cloud_type: {
                    displayName: 'Type of Cloud',
                    headerStyle: styles.headerDark,
                    width: 110 
                },
                speaker_key_message: {
                    displayName: 'Key Message',
                    headerStyle: styles.headerDark,
                    width: 110 
                },
                speaker_client_role: {
                    displayName: 'Client Roles',
                    headerStyle: styles.headerDark,
                    width: 110 
                },
            }

            var specification = {
                speaker_email: { // <- the key should match the actual data key
                    displayName: 'Speaker Email id', // <- Here you specify the column header
                    headerStyle: styles.headerDark, // <- Header style
                    cellStyle: function(value, row) { // <- style renderer function
                        // if the status is 1 then color in green else color in red
                        // Notice how we use another cell value to style the current one
                        return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'ffffff'}}}; // <- Inline cell style is possible 
                    },
                    width: 120 // <- width in pixels
                },
                provider_email: {
                    displayName: 'Feedback Provider Email Id',
                    headerStyle: styles.headerDark,
                    width: 110
                },
                gym_market: {
                    displayName: 'Gym Market',
                    headerStyle: styles.headerDark,
                    width: 110 
                },
                gym_location: {
                    displayName: 'Gym Location',
                    headerStyle: styles.headerDark,
                    width: 110 
                },
                gym_date: {
                    displayName: 'Gym Date',
                    headerStyle: styles.headerDark,
                    width: 110 
                },
                gym_status: {
                    displayName: 'Status',
                    headerStyle: styles.headerDark,
                    cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
                        return (value == 1) ? 'Active' : 'Expired';
                    },
                    width: 50 // <- width in chars (when the number is passed as string)
                },
            }
  
            
            datasetForgym={}
            results[1].forEach(function(gyms){
                datasetForgym[gyms.id]={
                    gym_market:gyms.gym_market,
                    gym_status:gyms.gym_stat,
                    gym_date:gyms.gym_date,
                    gym_location:gyms.gym_location
                }
            });
            var dataset2=[]
            datasetForspeaker={}
            results[3].forEach(function(speakers){
                
                dataset2dict={
                    speaker_email: speakers.speaker_w3_id,
                    speaker_reg_date: speakers.speaker_reg_date,
                    speaker_market: speakers.speaker_market,
                    speaker_location: speakers.speaker_location,
                    speaker_account: speakers.speaker_account,
                    speaker_client_background: speakers.speaker_client_background,
                    speaker_sales_journey:speakers.speaker_sales_journey,
                    speaker_cloud_pattern:speakers.speaker_cloud_pattern,
                    speaker_cloud_type: speakers.speaker_cloud_type,
                    speaker_key_message:speakers.speaker_key_message,
                    speaker_client_role:speakers.speaker_client_role
                }
                datasetForspeaker[speakers.id]=dataset2dict
                dataset2.push(dataset2dict)
            });
            
            results[0].forEach(function(questions,qindex){

                specification["question"+qindex]={
                    displayName: questions.question_text,
                    headerStyle: styles.headerDark,
                    width: 120 // <- width in pixels
                }
            });
            /*
            datasetForspeaker[speakers.id]={
                    speaker_w3_id:speakers.speaker_w3_id,
                    speaker_gym:speakers.speaker_gym,
                    speaker_name:speakers.speaker_name,
                    speaker_market:speakers.speaker_market,
                    speaker_location:speakers.speaker_location,
                    speaker_account:speakers.speaker_account,
                    speaker_client_background:speakers.speaker_client_background,
                    speaker_sales_journey:speakers.speaker_sales_journey,
                    speaker_cloud_pattern:speakers.speaker_cloud_pattern,
                    speaker_cloud_type:speakers.speaker_cloud_type,
                    speaker_key_message:speakers.speaker_key_message,
                    speaker_client_role:speakers.speaker_client_role,
                    speaker_reg_date:speakers.speaker_reg_date
                }
            datasetForfeedback[feedbacks.id]={
                    gym_market:gyms.gym_market,
                    gym_status:gyms.gym_stat,
                    gym_date:gyms.gym_date,
                    gym_location:gyms.gym_location,
                }
                const dataset2 = [
                {customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown'},
                {customer_name: 'HP', status_id: 0, note: 'some note'},
                {customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown'}
            ]
            */
            var dataset = []
            datasetForfeedback={}
            results[2].forEach(function(feedbacks){
                datasetdict={
                    speaker_email: datasetForspeaker[feedbacks.SpeakerId].speaker_email, 
                    provider_email: feedbacks.feedback_user, 
                    gym_market: datasetForgym[feedbacks.GymId].gym_market,
                    gym_location:datasetForgym[feedbacks.GymId].gym_location,
                    gym_date:datasetForgym[feedbacks.GymId].gym_date,
                    gym_status:datasetForgym[feedbacks.GymId].gym_status,
                    question0:feedbacks.rating1,
                    question1:feedbacks.rating2,
                    question2:feedbacks.rating3,
                    question3:feedbacks.rating4,
                    question4:feedbacks.rating5,
                    question5:feedbacks.rating6,
                    question6:feedbacks.rating7,
                    question7:feedbacks.rating8,
                    question8:feedbacks.rating9,
                    question9:feedbacks.rating10,
                    question10:feedbacks.comment1,
                }
                dataset.push(datasetdict)
            });

            
            
            // Define an array of merges. 1-1 = A:1
            // The merges are independent of the data.
            // A merge will overwrite all data _not_ in the top-left cell.
            const merges = [
              
            ]
            
            // Create the excel report.
            // This function will return Buffer
            const report = excel.buildExport(
                [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                    {
                        name: 'Feedback', // <- Specify sheet name (optional)
                        merges: merges, // <- Merge cell ranges
                        specification: specification, // <- Report specification
                        data: dataset // <-- Report data
                    },
                    {
                        name: 'Registrations', // <- Specify sheet name (optional)
                        merges: merges, // <- Merge cell ranges
                        specification: specification2, // <- Report specification
                        data: dataset2 // <-- Report data
                    }
                ]
            );
            nowdate=new Date()
            today=nowdate.getFullYear()+""+nowdate.getMonth()+""+nowdate.getDay()
            res.attachment("Gym_exported_"+today+".xlsx"); 
            return res.send(report);
        }
    );
  });
  // Default to index.html
  app.use(function (req, res) {
    console.log()
    if (req.isAuthenticated()) {
        res.render(path.resolve('public/index'), {
        environment: process.env.NODE_ENV,
        loggedIn: !!req.isAuthenticated(),
        user: JSON.stringify(req.user || {})
        });
    }
    else {
        res.render(path.resolve('public/userindex'), {
            environment: process.env.NODE_ENV,
            loggedIn: !!req.isAuthenticated(),
            user: JSON.stringify(req.user || {})
            });
    }
  });

  app.set('port', process.env.PORT || 4000);

  return app;
}
