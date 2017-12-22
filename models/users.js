'use strict';
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    user_w3_id: {
        type: DataTypes.STRING,
        unique: true
    },
    username: DataTypes.STRING,
    user_call: DataTypes.STRING,
  }, {
      classMethods: {
        associate: function (models) {
          User.hasMany(models.Feedback);
        }
      }
    });
  return User;
};
