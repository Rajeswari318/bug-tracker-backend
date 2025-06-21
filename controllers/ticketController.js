import mongoose from "mongoose";
import Ticket from "../models/ticketModel.js";

// Create ticket
export const createTicket = async (req, res) => {
  const { title, description, priority, status, assignee, projectId } = req.body;

  if (!title || !projectId) {
    return res.status(400).json({ message: "Title and projectId are required" });
  }

  try {
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      status,
      assignee,
      project: projectId, // ✅ Use 'project' field, not 'projectId'
      createdBy: req.user.id,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Failed to create ticket", error: error.message });
  }
};

// Get tickets by project (expects query ?projectId=)
export const getTicketsByProject = async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ message: "Project ID is required" });

    const tickets = await Ticket.find({ project: new mongoose.Types.ObjectId(projectId) });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Failed to get tickets", error: error.message });
  }
};

// Update ticket
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, description, priority, status } = req.body;
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (priority) ticket.priority = priority;
    if (status) ticket.status = status;

    const updated = await ticket.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update ticket", error: error.message });
  }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await ticket.deleteOne();
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete ticket", error: error.message });
  }
};

// Assign ticket to a user
export const assignTicket = async (req, res) => {
  const { assignee } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.assignee = assignee;
    const updated = await ticket.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to assign ticket", error: error.message });
  }
};
