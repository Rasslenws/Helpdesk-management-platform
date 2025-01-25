module.exports = (sequelize, Sequelize) => {

    return sequelize.define(
      "notifications", 
      {
        NotificationId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          Content: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          IsRead: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
      },
      
  
      {
        timestamps: true,  
        createdAt: true, 
        updatedAt: false, 
      }
    );
  };
  