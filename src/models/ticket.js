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
        allowNull: false,
      }
    },
    {
      timestamps: true,
      createdAt: true,
      updatedAt: false,
    }
  );
};
