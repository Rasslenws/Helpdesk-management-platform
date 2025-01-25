module.exports = (sequelize, Sequelize) => {

    return sequelize.define(
      "tickets", 
      {
        TicketId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        }, 
        
        Title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        Description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          Status: {
            type: Sequelize.STRING,
            defaultValue: "open",
          },
          Priority: {
            type: Sequelize.STRING,
            defaultValue: "medium", // Peut être "low", "medium", "high"
          },
    
          Category: {
            type: Sequelize.STRING,
            defaultValue: "General", // Catégorie par défaut
          },
    
          AssignedTo: {
            type: Sequelize.STRING,
            allowNull: true, // Par défaut non assigné
          },
          
      },
      
  
      {
        timestamps: true,  
        createdAt: true, 
        updatedAt: false, 
      }
    );
  };
  