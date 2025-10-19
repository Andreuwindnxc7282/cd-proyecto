import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:3000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  // Fetch tasks on component mount
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

  // Refetch when filter changes
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
        setNewTask({ title: '', description: '' });
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

  const handleMarkAllCompleted = async () => {
    try {
      await fetch(`${API_BASE_URL}/mark-all-completed`, { method: 'PATCH' });
      fetchTasks();
    } catch (error) {
      console.error('Error marking all completed:', error);
    }
  };

  const handleDeleteCompleted = async () => {
    try {
      await fetch(`${API_BASE_URL}/completed`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting completed tasks:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setEditForm({ title: task.title, description: task.description || '' });
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
        setEditForm({ title: '', description: '' });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditForm({ title: '', description: '' });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="App">
      <h1>To-Do List</h1>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>Pending</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
      </div>

      {/* Bulk Actions */}
      <div className="bulk-actions">
        <button onClick={handleMarkAllCompleted}>Mark All as Completed</button>
        <button onClick={handleDeleteCompleted}>Delete Completed</button>
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map(task => (
            <li key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id, task.completed)}
              />
              <div className="task-content">
                {editingTask === task.id ? (
                  <form onSubmit={handleSaveEdit} className="edit-form">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Description (optional)"
                    />
                    <div className="edit-buttons">
                      <button type="submit">Save</button>
                      <button type="button" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                    <small>Created: {new Date(task.createdAt).toLocaleString()}</small>
                  </>
                )}
              </div>
              {editingTask !== task.id && (
                <div className="task-actions">
                  <button onClick={() => handleEditTask(task)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
