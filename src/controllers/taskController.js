import Task from "../models/Task.js";

// Create task
export const createTask = async (req, res) => {
  const { title, description, completed } = req.body;

  try {
    const task = new Task({
      title,
      description,
      completed,
      owner: req.user._id,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (task) {
      if (task.owner.toString() === req.user._id.toString()) {
        await Task.findByIdAndDelete(id);
        res.json({ message: "Task removed" });
      } else {
        res.status(401).json({ message: "Not authorized to delete this task" });
      }
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
