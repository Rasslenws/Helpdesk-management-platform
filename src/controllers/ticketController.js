const { User ,Ticket } = require("../db/index.js");


// Créer un nouveau ticket
exports.createTickets = async (req, res) => {
  try {
    const { Title, Description, Priority, AssignedTo, Category } = req.body;
    if (!Title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const ticket = await Ticket.create({
      Title : Title,
      Description : Description,
      Priority: Priority || "medium",
      AssignedTo: AssignedTo || null,
      Category: Category || "General",
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error creating ticket." });
  }
};

// Récupérer tous les tickets
exports.getAllTickets = async (req, res) => {
  try {
    const { status, priority, category, UserId } = req.query;

    //filtrage 
    const condition = {}; // Initialize an empty 'condition' object

    if (status) condition.Status = status;
    if (priority) condition.Priority = priority;
    if (category) condition.Category = category;
    if (UserId) condition.AssignedTo = UserId;

    const tickets = await Ticket.findAll({ where: condition }); // récupérer tous les tickets
    res.status(200).json(tickets);
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

// Mettre à jour un ticket
exports.updateTicket = async (req, res) => {
  try {
    const { TicketId } = req.params;
    const { Title, Description, Status, Priority, AssignedTo, Category } = req.body;

    //retourne un tableau avec le nombre de lignes affectées par la mise à jour (if updated=1 if not updated=0)
    const [updated] = await Ticket.update(
        { Title, Description, Status, Priority, AssignedTo, Category },
        { where: { TicketId } }
    );

    if (!updated) {
      return res.status(404).json({ message: `Ticket with ID ${TicketId} not found.` });
    }

    const updatedTicket = await Ticket.findByPk(TicketId);
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: "Error updating ticket." });
  }
};

// Supprimer un ticket
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

// Réassigner un ticket à un agent
exports.assignTicket = async (req, res) => {
  try {
    const { TicketId } = req.params;
    const { AssignedTo } = req.body;

    if (!AssignedTo) {
      return res.status(400).json({ message: "Assigned agent is required." });
    }

    const user = await User.findByPk(AssignedTo);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const [updated] = await Ticket.update(
      { AssignedTo : AssignedTo },
      { where: { TicketId } }
    );


    if (!updated) {
      return res.status(404).json({ message: `Ticket with ID ${TicketId} not found.` });
    }

    const updatedTicket = await Ticket.findByPk(TicketId);
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message:  "Error assigning ticket." });
  }
};
