var mysql = require('mysql');
var db_config = require('../config/config.json');

var connection = mysql.createConnection({
    host     : db_config.development.host,
    user     : db_config.development.username,
    password : db_config.development.password,
    database:db_config.development.database
});

//const con = mysql.createConnection(db_config.development);
//console.log(connection)

var getQuestion= function (question_group,callback)
{
    (question_group)?"":question_group=1;
    connection.query('SELECT * FROM Questions where question_group=? order by question_order',[ question_group ], function(err, result)
    {
        if (err) 
            callback(err,null);
        else
            callback(null,result);
    });
}
var getGym= function (callback)
{
    connection.query('SELECT * FROM Gyms order by gym_date', function(err, result)
    {
        if (err) 
            callback(err,null);
        else
            callback(null,result);
    });
}
var getSpeaker= function (callback)
{
    connection.query('SELECT * FROM Speakers order by speaker_reg_date desc', function(err, result)
    {
        if (err) 
            callback(err,null);
        else
            callback(null,result);
    });
}
var getFeedback= function (callback)
{
    connection.query('SELECT * FROM Feedbacks order by GymId desc,feedback_date desc', function(err, result)
    {
        if (err) 
            callback(err,null);
        else
            callback(null,result);
    });
}
module.exports.getQuestion = getQuestion;
module.exports.getGym = getGym;
module.exports.getFeedback = getFeedback;
module.exports.getSpeaker = getSpeaker;
module.exports.connection = connection;