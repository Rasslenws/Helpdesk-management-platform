module.exports = (sequelize, Sequelize) => {

  return sequelize.define(
    "users", 
    {
      UserId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      }, 
     
      Login: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      Password: Sequelize.STRING, 
    },
  
    {
      timestamps: true, 
      createdAt: true, 
      updatedAt: false,
    }
  
  );
};
