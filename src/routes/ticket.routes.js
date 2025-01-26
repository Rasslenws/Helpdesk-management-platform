const ticketcontroller = require("../controllers/ticketController");

module.exports = (app) => {
app.post("/api/addticket", ticketcontroller.createTickets);
app.get("/api/AllTickets", ticketcontroller.getAllTickets);
app.get("/api/Ticket/:TicketId", ticketcontroller.getTicketById);
app.put("/api/UpdateTicket/:TicketId", ticketcontroller.updateTicket);
app.delete("/api/DeleteTicket/:TicketId", ticketcontroller.deleteTicket);
app.post("/api/AssignTicket/:TicketId/assign/:UserId", ticketcontroller.assignAgentToTicket);

  
};
