const Sequelize = require("sequelize").Sequelize;
// ORM => Sequelize


const userModel = require("../models/user");
const roleModel = require("../models/role");
const ticketModel = require("../models/ticket");
const notificationModel = require("../models/notification");
const cartegoryModel= require("../models/category");




// variable <= fichier model



const sequelizeConfig = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.dialect,
  }
);
// definition d'une variable sequelizeConfig ( les paramètres de db )


async function main() {
  try {
      await sequelizeConfig
      .authenticate() // connexion avec db
      .then(() => {
        console.log(
          "✔ Connection has been established successfully.".underline
        ); // message success :  Connection has been established successfully 
      })
      .catch((err) => {
        console.error(`Unable to connect to the database : ${err}`.bgRed);
      });  // failed message :  Unable to connect to the database (background rouge)



    await sequelizeConfig
      .sync({force:false}) // migration  // true => whole migration  // false : migration que les tables non crées
      .then(() => {
        console.log("tables created !".underline);
      })
      // message success :  tables created

      .catch((err) => {
        console.log(err);
      });
       // failed message :  error
  } catch (err) {
    console.error(`Unable to connect to the database : ${err}`.bgRed);
  }
}


const Ticket = ticketModel(sequelizeConfig, Sequelize);
const Notification = notificationModel(sequelizeConfig, Sequelize);
const User = userModel(sequelizeConfig, Sequelize);
const Role = roleModel(sequelizeConfig, Sequelize);
const Category = cartegoryModel(sequelizeConfig, Sequelize);








User.belongsTo(Role, { foreignKey: "RoleId"});
Role.hasMany(User, { foreignKey: "RoleId" });

User.hasMany(Ticket, { foreignKey: "EmployeeId" });
Ticket.belongsTo(User, { foreignKey: "EmployeeId", as: "employee" });

User.hasMany(Ticket, { foreignKey: "AssignedToId" });
Ticket.belongsTo(User, { foreignKey: "AssignedToId", as: "assignedTo" });

Category.hasMany(Ticket, { foreignKey: "CategoryId" });
Ticket.belongsTo(Category, { foreignKey: "CategoryId" });


User.hasMany(Notification, { foreignKey: "UserId" });
Notification.belongsTo(User, { foreignKey: "UserId" });




main();
module.exports = {
  User,Role, Ticket, Notification,Category,
  sequelizeConfig,
  Sequelize
};
