const usercontroller = require("../controllers/userController");

module.exports = (app) => {
  app.post("/api/addEmployee", usercontroller.addEmployee);
  app.post("/api/addAdmin", usercontroller.addAdmin);
  app.post("/api/authenticateUser", usercontroller.authenticateUser);
  app.post("/api/authenticateAdmin", usercontroller.authenticateAdmin);

  


};
