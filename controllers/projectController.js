// ✅ projectController.js
import Project from "../models/projectModel.js";

// Create Project
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    const newProject = await Project.create({
      title,
      description,
      createdBy: req.user.id,
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project", error: error.message });
  }
};

// Get Projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
};

// Update Project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.createdBy.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized" });

    const { title, description } = req.body;
    if (title) project.title = title;
    if (description) project.description = description;

    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update project", error: error.message });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.createdBy.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized" });

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};