const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Get all developers
exports.getAllDevelopers = (req, res) => {
  db.all('SELECT * FROM developers', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    
    // Parse JSON fields
    const developers = rows.map(dev => ({
      ...dev,
      skills: JSON.parse(dev.skills),
      achievement_badges: JSON.parse(dev.achievement_badges)
    }));
    
    res.json({ success: true, data: developers });
  });
};

// Get developer by ID
exports.getDeveloperById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM developers WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, error: 'Developer not found' });
    }
    
    const developer = {
      ...row,
      skills: JSON.parse(row.skills),
      achievement_badges: JSON.parse(row.achievement_badges)
    };
    
    res.json({ success: true, data: developer });
  });
};

// Create new developer
exports.createDeveloper = (req, res) => {
  const { name, email, avatar_url, role, skills } = req.body;
  
  if (!name || !email || !role) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name, email, and role are required' 
    });
  }
  
  const id = uuidv4();
  const joined_date = new Date().toISOString();
  const skillsJson = JSON.stringify(skills || {});
  const achievementBadges = JSON.stringify([]);
  
  db.run(`
    INSERT INTO developers (id, name, email, avatar_url, role, skills, joined_date, 
                           total_tasks_completed, current_streak, achievement_badges, focus_time_today)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, 0)
  `, [id, name, email, avatar_url, role, skillsJson, joined_date, achievementBadges], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ success: false, error: 'Email already exists' });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
    
    res.status(201).json({ 
      success: true, 
      data: { 
        id, 
        name, 
        email, 
        avatar_url, 
        role, 
        skills: skills || {}, 
        joined_date,
        total_tasks_completed: 0,
        current_streak: 0,
        achievement_badges: [],
        focus_time_today: 0
      } 
    });
  });
};

// Update developer
exports.updateDeveloper = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Build dynamic update query
  const allowedFields = ['name', 'email', 'avatar_url', 'role', 'skills', 'total_tasks_completed', 
                         'current_streak', 'achievement_badges', 'focus_time_today'];
  const setClause = [];
  const values = [];
  
  Object.keys(updates).forEach(key => {
    if (allowedFields.includes(key)) {
      setClause.push(`${key} = ?`);
      if (key === 'skills' || key === 'achievement_badges') {
        values.push(JSON.stringify(updates[key]));
      } else {
        values.push(updates[key]);
      }
    }
  });
  
  if (setClause.length === 0) {
    return res.status(400).json({ success: false, error: 'No valid fields to update' });
  }
  
  values.push(id);
  
  db.run(
    `UPDATE developers SET ${setClause.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Developer not found' });
      }
      
      res.json({ success: true, message: 'Developer updated successfully' });
    }
  );
};

// Delete developer
exports.deleteDeveloper = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM developers WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: 'Developer not found' });
    }
    
    res.json({ success: true, message: 'Developer deleted successfully' });
  });
};

// Get developer statistics
exports.getDeveloperStats = (req, res) => {
  const { id } = req.params;
  
  // Get developer info
  db.get('SELECT * FROM developers WHERE id = ?', [id], (err, developer) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!developer) {
      return res.status(404).json({ success: false, error: 'Developer not found' });
    }
    
    // Get task statistics
    db.all(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(actual_hours) as total_hours
      FROM tasks 
      WHERE assigned_to = ?
      GROUP BY status
    `, [id], (err, taskStats) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      
      const stats = {
        developer: {
          ...developer,
          skills: JSON.parse(developer.skills),
          achievement_badges: JSON.parse(developer.achievement_badges)
        },
        tasks_by_status: taskStats,
        total_hours_logged: taskStats.reduce((sum, stat) => sum + (stat.total_hours || 0), 0)
      };
      
      res.json({ success: true, data: stats });
    });
  });
};

// Get developer's tasks
exports.getDeveloperTasks = (req, res) => {
  const { id } = req.params;
  const { status } = req.query;
  
  let query = 'SELECT * FROM tasks WHERE assigned_to = ?';
  const params = [id];
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
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