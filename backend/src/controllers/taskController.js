const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Get all tasks with filters
exports.getAllTasks = (req, res) => {
  const { status, priority, assigned_to, sprint_number } = req.query;
  
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  if (assigned_to) {
    query += ' AND assigned_to = ?';
    params.push(assigned_to);
  }
  if (sprint_number) {
    query += ' AND sprint_number = ?';
    params.push(sprint_number);
  }
  
  query += ' ORDER BY created_at DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    
    const tasks = rows.map(task => ({
      ...task,
      tech_stack: JSON.parse(task.tech_stack)
    }));
    
    res.json({ success: true, data: tasks });
  });
};

// Get task by ID
exports.getTaskById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const task = {
      ...row,
      tech_stack: JSON.parse(row.tech_stack)
    };
    
    res.json({ success: true, data: task });
  });
};

// Create new task
exports.createTask = (req, res) => {
  const {
    title,
    description,
    status = 'backlog',
    priority = 'medium',
    difficulty = 3,
    tech_stack = [],
    assigned_to,
    created_by,
    estimated_hours,
    due_date,
    code_snippet,
    sprint_number
  } = req.body;
  
  if (!title) {
    return res.status(400).json({ success: false, error: 'Title is required' });
  }
  
  const id = uuidv4();
  const created_at = new Date().toISOString();
  const updated_at = created_at;
  const tech_stack_json = JSON.stringify(tech_stack);
  
  db.run(`
    INSERT INTO tasks (id, title, description, status, priority, difficulty, tech_stack,
                      assigned_to, created_by, created_at, updated_at, estimated_hours,
                      actual_hours, due_date, code_snippet, sprint_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
  `, [id, title, description, status, priority, difficulty, tech_stack_json,
      assigned_to, created_by, created_at, updated_at, estimated_hours,
      due_date, code_snippet, sprint_number], function(err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    
    // Log task creation in history
    const historyId = uuidv4();
    db.run(`
      INSERT INTO task_history (id, task_id, action, performed_by, timestamp, new_value)
      VALUES (?, ?, 'created', ?, ?, ?)
    `, [historyId, id, created_by, created_at, JSON.stringify({ title, status })]);
    
    res.status(201).json({
      success: true,
      data: {
        id,
        title,
        description,
        status,
        priority,
        difficulty,
        tech_stack,
        assigned_to,
        created_by,
        created_at,
        updated_at,
        estimated_hours,
        actual_hours: 0,
        due_date,
        code_snippet,
        sprint_number
      }
    });
  });
};

// Update task
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const allowedFields = ['title', 'description', 'status', 'priority', 'difficulty',
                         'tech_stack', 'assigned_to', 'estimated_hours', 'actual_hours',
                         'due_date', 'code_snippet', 'sprint_number'];
  const setClause = [];
  const values = [];
  
  Object.keys(updates).forEach(key => {
    if (allowedFields.includes(key)) {
      setClause.push(`${key} = ?`);
      if (key === 'tech_stack') {
        values.push(JSON.stringify(updates[key]));
      } else {
        values.push(updates[key]);
      }
    }
  });
  
  if (setClause.length === 0) {
    return res.status(400).json({ success: false, error: 'No valid fields to update' });
  }
  
  setClause.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(id);
  
  db.run(
    `UPDATE tasks SET ${setClause.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      
      // Log update in history
      const historyId = uuidv4();
      db.run(`
        INSERT INTO task_history (id, task_id, action, performed_by, timestamp, new_value)
        VALUES (?, ?, 'updated', NULL, ?, ?)
      `, [historyId, id, new Date().toISOString(), JSON.stringify(updates)]);
      
      res.json({ success: true, message: 'Task updated successfully' });
    }
  );
};

// Update task status
exports.updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { status, performed_by } = req.body;
  
  if (!status) {
    return res.status(400).json({ success: false, error: 'Status is required' });
  }
  
  const validStatuses = ['backlog', 'todo', 'in-progress', 'review', 'testing', 'done'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }
  
  // Get old status first
  db.get('SELECT status FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const old_status = row.status;
    
    db.run(
      'UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?',
      [status, new Date().toISOString(), id],
      function(err) {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }
        
        // Log status change in history
        const historyId = uuidv4();
        db.run(`
          INSERT INTO task_history (id, task_id, action, performed_by, timestamp, old_value, new_value)
          VALUES (?, ?, 'status_changed', ?, ?, ?, ?)
        `, [historyId, id, performed_by, new Date().toISOString(), old_status, status]);
        
        res.json({ success: true, message: 'Task status updated successfully' });
      }
    );
  });
};

// Assign task to developer
exports.assignTask = (req, res) => {
  const { id } = req.params;
  const { assigned_to, performed_by } = req.body;
  
  if (!assigned_to) {
    return res.status(400).json({ success: false, error: 'assigned_to is required' });
  }
  
  // Check if developer exists
  db.get('SELECT id FROM developers WHERE id = ?', [assigned_to], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, error: 'Developer not found' });
    }
    
    db.run(
      'UPDATE tasks SET assigned_to = ?, updated_at = ? WHERE id = ?',
      [assigned_to, new Date().toISOString(), id],
      function(err) {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }
        if (this.changes === 0) {
          return res.status(404).json({ success: false, error: 'Task not found' });
        }
        
        // Log assignment in history
        const historyId = uuidv4();
        db.run(`
          INSERT INTO task_history (id, task_id, action, performed_by, timestamp, new_value)
          VALUES (?, ?, 'assigned', ?, ?, ?)
        `, [historyId, id, performed_by, new Date().toISOString(), assigned_to]);
        
        res.json({ success: true, message: 'Task assigned successfully' });
      }
    );
  });
};

// Delete task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    // Delete related history
    db.run('DELETE FROM task_history WHERE task_id = ?', [id]);
    
    res.json({ success: true, message: 'Task deleted successfully' });
  });
};

// Get task history
exports.getTaskHistory = (req, res) => {
  const { id } = req.params;
  
  db.all(
    'SELECT * FROM task_history WHERE task_id = ? ORDER BY timestamp DESC',
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      
      res.json({ success: true, data: rows });
    }
  );
};