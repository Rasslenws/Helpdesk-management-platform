module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
      "categories",
      {
        CategoryId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        Name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        timestamps: false,
      }
    );
  };
  