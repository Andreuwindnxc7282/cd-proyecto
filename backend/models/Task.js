const db = require('../config/db');

class Task {
  static async getAll(completed = null) {
    let query = 'SELECT * FROM tasks';
    const params = [];

    if (completed !== null) {
      query += ' WHERE completed = ?';
      params.push(completed);
    }

    query += ' ORDER BY createdAt DESC';

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(title, description = null) {
    const [result] = await db.execute(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title, description]
    );
    return result.insertId;
  }

  static async update(id, title, description, completed) {
    const [result] = await db.execute(
      'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
      [title, description, completed, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM tasks WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async markAllAsCompleted() {
    const [result] = await db.execute('UPDATE tasks SET completed = TRUE');
    return result.affectedRows;
  }

  static async deleteAllCompleted() {
    const [result] = await db.execute('DELETE FROM tasks WHERE completed = TRUE');
    return result.affectedRows;
  }
}

module.exports = Task;