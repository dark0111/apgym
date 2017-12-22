'use strict';
module.exports = function (sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    questionId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    question_text: DataTypes.STRING(200),
    question_type: {
        type:   DataTypes.ENUM,
        values: ['rate', 'text', 'date']
    },
    question_group: DataTypes.INTEGER
  }, {
      classMethods: {
        associate: function (models) {
          
        }
      }
    });
  return Question;
};
