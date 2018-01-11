'use strict';
module.exports = function (sequelize, DataTypes) {
  var Speaker = sequelize.define('Speaker', {
    speaker_w3_id: {
        type: DataTypes.STRING,
        unique: 'unique_gym_speaker'
    },
    speaker_gym: {
        type: DataTypes.INTEGER,
        unique: 'unique_gym_speaker'
    },
    speaker_name: DataTypes.STRING(100),
    speaker_location: DataTypes.STRING(200),
    speaker_market: DataTypes.STRING(200),
    speaker_account: DataTypes.STRING(200),
    speaker_client_background: DataTypes.STRING(200),
    speaker_sales_journey: DataTypes.STRING(200),
    speaker_cloud_pattern: DataTypes.STRING(200),
    speaker_cloud_type: DataTypes.STRING(200),
    speaker_key_message: DataTypes.STRING(200),
    speaker_client_role: DataTypes.STRING(200),
    speaker_reg_date: DataTypes.DATE
  }, {
      classMethods: {
        associate: function (models) {
          Speaker.hasMany(models.Feedback);
        }
      }
    });
  return Speaker;
};
