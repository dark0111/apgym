'use strict';
module.exports = function (sequelize, DataTypes) {
    var Gym = sequelize.define('Gym', {
        gymId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        gym_title: DataTypes.STRING(200),
        gym_market: DataTypes.STRING(200),
        gym_location: DataTypes.STRING(200),
        gym_description: DataTypes.STRING(1000),
        gym_date: DataTypes.DATE,
    }, 
    {
        classMethods: {
            associate: function (models) {
            Gym.hasMany(models.Feedback);
            }
        }
    });
    return Gym;
};
