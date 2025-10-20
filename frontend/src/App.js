import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', category: '', dueDate: '' });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', priority: 'medium', category: '', dueDate: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? API_BASE_URL : `${API_BASE_URL}?completed=${filter === 'completed'}`;
      const response = await fetch(url);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        setNewTask({ title: '', description: '', priority: 'medium', category: '', dueDate: '' });
        setShowAddForm(false);
        fetchTasks();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setEditForm({ title: task.title, description: task.description || '', priority: task.priority || 'medium', category: task.category || '', dueDate: task.dueDate || '' });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${editingTask}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        setEditingTask(null);
        setEditForm({ title: '', description: '', priority: 'medium', category: '', dueDate: '' });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditForm({ title: '', description: '', priority: 'medium', category: '', dueDate: '' });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#E74C3C';
      case 'medium': return '#F39C12';
      case 'low': return '#27AE60';
      default: return '#BDC3C7';
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Lista de Tareas</h1>
        <div className="filters">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>Todas</button>
          <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>Pendientes</button>
          <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completadas</button>
        </div>
      </header>

      <main className="task-list-container">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ul className="task-list">
            {filteredTasks.map(task => (
              <li key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-header">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id, task.completed)}
                    aria-label={`Marcar ${task.title} como ${task.completed ? 'incompleta' : 'completa'}`}
                  />
                  <span className="priority-indicator" style={{ backgroundColor: getPriorityColor(task.priority) }}></span>
                  {task.category && <span className="category-tag">{task.category}</span>}
                </div>
                <div className="task-content">
                  {editingTask === task.id ? (
                    <form onSubmit={handleSaveEdit} className="edit-form">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        required
                        aria-label="Editar título de la tarea"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Descripción (opcional)"
                        aria-label="Editar descripción de la tarea"
                      />
                      <select value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}>
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                      </select>
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        placeholder="Categoría"
                      />
                      <input
                        type="date"
                        value={editForm.dueDate}
                        onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      />
                      <div className="edit-buttons">
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={handleCancelEdit}>Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3>{task.title}</h3>
                      {task.description && <p>{task.description}</p>}
                      {task.dueDate && <small>Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}</small>}
                      <small>Creada: {new Date(task.createdAt).toLocaleString('es-ES')}</small>
                    </>
                  )}
                </div>
                {editingTask !== task.id && (
                  <div className="task-actions">
                    <button onClick={() => handleEditTask(task)} className="edit-btn" aria-label="Editar tarea">Editar</button>
                    <button onClick={() => handleDeleteTask(task.id)} className="delete-btn" aria-label="Eliminar tarea">Eliminar</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="add-task-footer">
        <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">+ Agregar Tarea</button>
        {showAddForm && (
          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              placeholder="Título de la tarea"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
              aria-label="Nuevo título de la tarea"
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              aria-label="Nueva descripción de la tarea"
            />
            <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
            <input
              type="text"
              placeholder="Categoría"
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <button type="submit">Agregar Tarea</button>
            <button type="button" onClick={() => setShowAddForm(false)}>Cancelar</button>
          </form>
        )}
      </footer>
    </div>
  );
}

export default App;
