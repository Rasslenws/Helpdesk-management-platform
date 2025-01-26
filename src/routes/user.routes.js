const usercontroller = require("../controllers/userController");

module.exports = (app) => {
  app.post("/api/addEmployee", usercontroller.addEmployee);
  app.post("/api/addAdmin", usercontroller.addAdmin);
  app.post("/api/addSupportTeam", usercontroller.addSupportTeam);
  app.put("/api/updateUser/:UserId", usercontroller.updateUser);
  app.post("/api/login", usercontroller.login);
  app.delete("/api/deleteUser/:UserId", usercontroller.deleteById);
  app.get("/api/allusers", usercontroller.getAllUsers);



  


};
