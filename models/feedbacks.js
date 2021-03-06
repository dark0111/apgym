'use strict';
module.exports = function (sequelize, DataTypes) {
  var Feedback = sequelize.define('Feedback', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    feedback_date: DataTypes.DATEONLY,
    feedback_user: DataTypes.STRING(100),
    rating1: DataTypes.INTEGER,
    rating2: DataTypes.INTEGER,
    rating3: DataTypes.INTEGER,
    rating4: DataTypes.INTEGER,
    rating5: DataTypes.INTEGER,
    rating6: DataTypes.INTEGER,
    rating7: DataTypes.INTEGER,
    rating8: DataTypes.INTEGER,
    rating9: DataTypes.INTEGER,
    rating10: DataTypes.INTEGER,
    comment1: DataTypes.STRING(1000)
  }, {
      classMethods: {
        associate: function (models) {
          Feedback.belongsTo(models.Gym);
          //Feedback.belongsToMany(models.User);
          Feedback.belongsTo(models.Speaker);
        }
      }
    });
  return Feedback;
};
