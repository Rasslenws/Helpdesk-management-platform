const { User, Ticket, Category, Role } = require("../db/index.js");

// Create a new category through TicketController
exports.createCategory = async (req, res) => {
  try {
    const { Name } = req.body;

    // Validate input
    if (!Name) {
      return res.status(400).json({ message: "Category Name is required." });
    }

    // Create the category
    const category = await Category.create({ Name });

    res.status(201).json({message: "Category created successfully."});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating category."});
  }
};

// Create a new ticket
exports.createTickets = async (req, res) => {
  try {
    const { Title, Description, Priority, CategoryId, EmployeeId } = req.body;

    // Check if required fields are provided
    if (!Title || !EmployeeId || !CategoryId) {
      return res.status(400).json({ message: "Title, EmployeeId, and CategoryId are required" });
    }

    // Check if the Category exists
    const category = await Category.findByPk(CategoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find an admin user to assign the ticket by default
    const adminRole = await Role.findOne({ where: { RoleName: "admin" } });
    const adminUser = adminRole ? await User.findOne({ where: { RoleId: adminRole.RoleId } }) : null;

    // Create the ticket
    const ticket = await Ticket.create({
      Title,
      Description,
      Priority: Priority || "medium",
      CategoryId,
      EmployeeId,
      Status: "Closed",
      AssignedToId: adminUser ? adminUser.UserId : null, // Assign to admin if available
    });

    res.status(201).json({message : "Ticket successfully created"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating ticket." });
  }
};

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["Login"],
        },
        {
          model: User,
          as: "assignedTo",
          attributes: ["Login"],
        },
        {
          model: Category,
          attributes: ["Name"],
        },
      ],
    });

    if (tickets.length === 0) {
      return res.status(404).json({ message: "No tickets in database" });
    }

    res.status(200).json({ message: "All Tickets", tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving tickets." });
  }
};

// Get a ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const { TicketId } = req.params;

    const ticket = await Ticket.findByPk(TicketId, {
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["Login"],
        },
        {
          model: User,
          as: "assignedTo",
          attributes: ["Login"],
        },
        {
          model: Category,
          attributes: ["Name"],
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({ message: `Ticket with ID ${TicketId} not found.` });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving ticket." });
  }
};

// Update a ticket
exports.updateTicket = async (req, res) => {
  try {
    const { TicketId } = req.params;
    const { Status, Title, Description, Priority, CategoryId, } = req.body;

    // Only allow status changes to valid values
    const validStatuses = ["Open", "Resolved", "in-progress", "Closed"];
    if (Status && !validStatuses.includes(Status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the ticket by ID
    const ticket = await Ticket.findByPk(TicketId);
    if (!ticket) {
      return res.status(404).json({ message: `Ticket with ID ${TicketId} not found.` });
    }

    // Check if the new CategoryId exists
    if (CategoryId) {
      const category = await Category.findByPk(CategoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    // Update ticket fields
    const updatedTicket = await ticket.update({
      Title: Title || ticket.Title,
      Description: Description || ticket.Description,
      Status: Status || ticket.Status,
      Priority: Priority || ticket.Priority,
      CategoryId: CategoryId || ticket.CategoryId,
    });

    res.status(200).json({message: "Ticket successfully updated"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating ticket." });
  }
};


// Delete a ticket
exports.deleteTicket = async (req, res) => {
  try {
    const { TicketId } = req.params;

    const deleted = await Ticket.destroy({ where: { TicketId } });

    if (!deleted) {
      return res.status(404).json({ message: `Ticket with ID ${TicketId} not found.` });
    }

    res.status(200).json({ message: "Ticket deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting ticket." });
  }
};


// Assign an agent to a ticket
exports.assignAgentToTicket = async (req, res) => {
  try {
    const { TicketId, UserId } = req.params;

    // Find the ticket
    const ticket = await Ticket.findByPk(TicketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Find the user
    const user = await User.findByPk(UserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assign the user to the ticket
    ticket.AssignedToId = user.UserId;
    ticket.Status = "in-progress"; // Change status to in-progress when assigned

    await ticket.save();

    res.status(200).json({ message: "Ticket assigned successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error assigning agent to ticket." });
  }
};
