module.exports = (app) => {
  const userRoutes = require("./user.routes")(app);
  const ticketRoutes = require("./ticket.routes")(app);

};


