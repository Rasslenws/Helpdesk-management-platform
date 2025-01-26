const { User ,Ticket, Role } = require("../db/index.js");

// Créer un nouveau ticket
exports.createTickets = async (req, res) => {
  try {
    const { Title, Description, Priority, Category, UserId } = req.body;

    // Check if the Title is provided
    if (!Title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Step 1: Retrieve the 'admin' role from the Role model
    const adminRole = await Role.findOne({ where: { RoleName: "admin" } });

    if (!adminRole) {
      return res.status(404).json({ message: "Admin role not found" });
    }
    
    // Step 2: Find a user with the 'admin' role
    const adminUser = await User.findOne({ where: { RoleId: adminRole.RoleId } });

    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    // Step 3: Create the ticket and assign it to the admin user by default
    const ticket = await Ticket.create({
      UserId,
      Title,
      Description,
      Priority: Priority || "medium",
      Category: Category || "General",
      Status: "Closed",
      AssignedTo: adminUser.Login,  // Assign the admin user to the ticket
    });

    // Respond with the created ticket
    res.status(201).json(ticket);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating ticket." });
  }
};


// Récupérer tous les tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll(); // récupérer tous les tickets
    if (tickets) {
      res.status(200).json({ message: "All Tickets", tickets });   
    }
    else{ 
      return res.status(404).json({ message: "No Tickets in DataBase" });
    }
    
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tickets." });
  }
};

// Récupérer un ticket par ID
exports.getTicketById = async (req, res) => {
  try {
    const { TicketId } = req.params; // object contains the route parameters from the URL of the request
    const ticket = await Ticket.findByPk(TicketId);

    if (!ticket) {
      return res.status(404).json({ message: `Ticket with ID ${TicketId} not found.` });  // `` create a dynamic string
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving ticket." });
  }
};


exports.updateTicket = async (req, res) => {
  try {
    const { TicketId } = req.params;
    const { Status, Title, Description, Priority, AssignedTo, Category } = req.body;

    // Only allow status changes to open, in-progress, resolved, or closed
    const validStatuses = ["Open", "Resolved", "in-progress", "Closed"];
    if (Status && !validStatuses.includes(Status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the ticket by ID
    const ticket = await Ticket.findByPk(TicketId);
    if (!ticket) {
      return res.status(404).json({ message: `Ticket with ID ${TicketId} not found.` });
    }

    // Update ticket fields (only fields that are provided in the request body)
    const updatedTicket = await ticket.update({
      Title: Title || ticket.Title,       // Keep existing title if not provided
      Description: Description || ticket.Description, // Keep existing description if not provided
      Status: Status || ticket.Status,     // Keep existing status if not provided
      Priority: Priority || ticket.Priority, // Keep existing priority if not provided
      AssignedTo: AssignedTo || ticket.AssignedTo, // Keep existing assigned user if not provided
      Category: Category || ticket.Category // Keep existing category if not provided
    });

    // Respond with the updated ticket
    res.status(200).json(updatedTicket);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating ticket." });
  }
};



// Delete  ticket
exports.deleteTicket = async (req, res) => {
  try {
    const { TicketId } = req.params;
    const deleted = await Ticket.destroy({ where: { TicketId } });

    if (!deleted) {
      return res.status(404).json({ message: `Ticket with ID ${TicketId} not found.` });
    }

    res.status(200).json({ message: "Ticket deleted successfully." });
  } catch (error) {
    res.status(500).json({ message:  "Error deleting ticket." });
  }
};



// Assign agent to a ticket
exports.assignAgentToTicket = async (req, res) => {
  try {
    const { TicketId, UserId } = req.params; 

    // Find the ticket by its ID
    const ticket = await Ticket.findByPk(TicketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Find the user by UserId
    const user = await User.findByPk(UserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assign the user's login (username) to the ticket's AssignedTo field
    ticket.AssignedTo = user.Login; 
    ticket.UserId = UserId; // Keep UserId for reference
    ticket.Status = "in-progress"; // Change status to in-progress when assigned

    await ticket.save(); // Save the updated ticket

    return res.status(200).json({ message: "Ticket assigned successfully", ticket });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



