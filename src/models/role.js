module.exports = (sequelize, Sequelize) => {

    return sequelize.define(
      "roles", 
      {
        RoleId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        }, 
        
        RoleName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
  
      {
        timestamps: true,  
        createdAt: true, 
        updatedAt: false, 
      }
    );
  };
  