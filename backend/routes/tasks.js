const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET /tasks → listar tareas (opcional: ?completed=true/false)
router.get('/', async (req, res) => {
  try {
    const { completed } = req.query;
    let completedBool = null;

    if (completed === 'true') completedBool = true;
    else if (completed === 'false') completedBool = false;

    const tasks = await Task.getAll(completedBool);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks → crear tarea
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const id = await Task.create(title, description);
    res.status(201).json({ id, title, description, completed: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /tasks/:id → actualizar tarea
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updated = await Task.update(id, title, description, completed);
    if (!updated) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tasks/:id → eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BONUS: Marcar todas como completadas
router.patch('/mark-all-completed', async (req, res) => {
  try {
    const count = await Task.markAllAsCompleted();
    res.json({ message: `${count} tareas marcadas como completadas` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BONUS: Eliminar todas las completadas
router.delete('/completed', async (req, res) => {
  try {
    const count = await Task.deleteAllCompleted();
    res.json({ message: `${count} tareas completadas eliminadas` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;