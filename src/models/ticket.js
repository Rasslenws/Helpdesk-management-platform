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
        defaultValue: "Closed",
      },
      Priority: {
        type: Sequelize.STRING,
        defaultValue: "medium",
      },
      AssignedToId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'UserId'
        },
        allowNull: false,
      },
      EmployeeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',  // Référence à la table 'users'
          key: 'UserId',   // Clé primaire de la table 'users'
        },
        allowNull: false,  // L'ID de l'employé est obligatoire
      },
    },
    {
      timestamps: true,
      createdAt: true,
      updatedAt: false,
    }
  );
};
