const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Créer un nouveau ticket
router.post('/api/tickets', ticketController.createTicket);

// Récupérer tous les tickets
router.get('/api/tickets', ticketController.getAllTickets);

// Récupérer un ticket par ID
router.get('/api/tickets/:id', ticketController.getTicketById);

// Mettre à jour un ticket
router.put('/api/tickets/:id', ticketController.updateTicket);

// Supprimer un ticket
router.delete('/api/tickets/:id', ticketController.deleteTicket);

// Réassigner un ticket à un agent
router.put('/api/tickets/:id/assign', ticketController.assignTicket);

module.exports = router;
