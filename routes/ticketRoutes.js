import express from "express";
import {
  createTicket,
  getTicketsByProject,
  updateTicket,
  deleteTicket,
  assignTicket,
} from "../controllers/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ POST /api/tickets
router.post("/", protect, createTicket);

// ✅ GET /api/tickets?projectId=123
router.get("/", protect, getTicketsByProject);

// ✅ PUT /api/tickets/:id
router.put("/:id", protect, updateTicket);

// ✅ DELETE /api/tickets/:id
router.delete("/:id", protect, deleteTicket);

// ✅ PATCH /api/tickets/:id/assign
router.patch("/:id/assign", protect, assignTicket);

export default router;
