import pool from '../config/db.js';

// GET /api/tasks — only THIS user's tasks
export async function getTasks(req, res) {
  try {
    const [tasks] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(tasks);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
}

// POST /api/tasks
export async function createTask(req, res) {
  try {
    const { title, description, status, due_date } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, due_date)
       VALUES (?, ?, ?, ?, ?)`,
      [req.userId, title, description || null, status || 'pending', due_date || null]
    );

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Failed to create task.' });
  }
}

// PUT /api/tasks/:id
export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status, due_date } = req.body;

    // "AND user_id = ?" is the critical line here. Without it, ANY
    // logged-in user could update ANY task just by guessing its id.
    const [result] = await pool.query(
      `UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ?
       WHERE id = ? AND user_id = ?`,
      [title, description, status, due_date, id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Failed to update task.' });
  }
}

// DELETE /api/tasks/:id
export async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Failed to delete task.' });
  }
}