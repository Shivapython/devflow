const db = require('../config/database');

// Get team performance metrics
exports.getTeamMetrics = (req, res) => {
  const queries = {
    totalTasks: 'SELECT COUNT(*) as count FROM tasks',
    completedTasks: 'SELECT COUNT(*) as count FROM tasks WHERE status = "done"',
    inProgressTasks: 'SELECT COUNT(*) as count FROM tasks WHERE status = "in-progress"',
    totalDevelopers: 'SELECT COUNT(*) as count FROM developers',
    tasksByStatus: 'SELECT status, COUNT(*) as count FROM tasks GROUP BY status',
    tasksByPriority: 'SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority',
    avgCompletionTime: `
      SELECT AVG(actual_hours) as avg_hours 
      FROM tasks 
      WHERE status = "done" AND actual_hours > 0
    `,
    totalHoursLogged: 'SELECT SUM(actual_hours) as total FROM tasks WHERE actual_hours > 0'
  };

  const results = {};
  let completed = 0;
  const totalQueries = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error(`Error in ${key}:`, err);
        results[key] = null;
      } else {
        results[key] = rows;
      }
      
      completed++;
      if (completed === totalQueries) {
        res.json({
          success: true,
          data: {
            overview: {
              total_tasks: results.totalTasks[0].count,
              completed_tasks: results.completedTasks[0].count,
              in_progress_tasks: results.inProgressTasks[0].count,
              total_developers: results.totalDevelopers[0].count,
              completion_rate: results.totalTasks[0].count > 0 
                ? ((results.completedTasks[0].count / results.totalTasks[0].count) * 100).toFixed(2)
                : 0
            },
            tasks_by_status: results.tasksByStatus,
            tasks_by_priority: results.tasksByPriority,
            performance: {
              avg_completion_time: results.avgCompletionTime[0].avg_hours 
                ? parseFloat(results.avgCompletionTime[0].avg_hours.toFixed(2))
                : 0,
              total_hours_logged: results.totalHoursLogged[0].total || 0
            }
          }
        });
      }
    });
  });
};

// Get sprint velocity data
exports.getVelocityData = (req, res) => {
  db.all(`
    SELECT 
      sprint_number,
      COUNT(*) as total_tasks,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completed_tasks,
      SUM(CASE WHEN status = 'done' THEN difficulty ELSE 0 END) as story_points_completed,
      SUM(difficulty) as total_story_points
    FROM tasks
    WHERE sprint_number IS NOT NULL
    GROUP BY sprint_number
    ORDER BY sprint_number
  `, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    
    res.json({ success: true, data: rows });
  });
};

// Identify bottlenecks (tasks stuck in review/testing)
exports.getBottlenecks = (req, res) => {
  const thresholdDays = 2; // Tasks stuck for more than 2 days
  const thresholdMs = thresholdDays * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(Date.now() - thresholdMs).toISOString();
  
  db.all(`
    SELECT 
      t.*,
      d.name as developer_name
    FROM tasks t
    LEFT JOIN developers d ON t.assigned_to = d.id
    WHERE t.status IN ('review', 'testing') 
      AND t.updated_at < ?
    ORDER BY t.updated_at ASC
  `, [cutoffDate], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    
    const tasks = rows.map(task => ({
      ...task,
      tech_stack: JSON.parse(task.tech_stack),
      days_stuck: Math.floor((Date.now() - new Date(task.updated_at).getTime()) / (24 * 60 * 60 * 1000))
    }));
    
    res.json({ 
      success: true, 
      data: tasks,
      count: tasks.length
    });
  });
};

// Get developer leaderboard
exports.getLeaderboard = (req, res) => {
  db.all(`
    SELECT 
      d.id,
      d.name,
      d.avatar_url,
      d.role,
      d.skills,
      d.achievement_badges,
      d.total_tasks_completed,
      d.current_streak,
      d.focus_time_today,
      COUNT(t.id) as active_tasks,
      SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as completed_this_sprint
    FROM developers d
    LEFT JOIN tasks t ON d.id = t.assigned_to
    GROUP BY d.id
    ORDER BY d.total_tasks_completed DESC, d.current_streak DESC
  `, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    
    const leaderboard = rows.map((dev, index) => ({
      ...dev,
      rank: index + 1,
      skills: JSON.parse(dev.skills || '{}'),
      achievement_badges: JSON.parse(dev.achievement_badges || '[]')
    }));
    
    res.json({ success: true, data: leaderboard });
  });
};

// Get task distribution by developer
exports.getTaskDistribution = (req, res) => {
  db.all(`
    SELECT 
      d.name,
      d.avatar_url,
      COUNT(t.id) as total_tasks,
      SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN t.status = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN t.status IN ('todo', 'backlog') THEN 1 ELSE 0 END) as pending,
      AVG(t.actual_hours) as avg_hours_per_task
    FROM developers d
    LEFT JOIN tasks t ON d.id = t.assigned_to
    GROUP BY d.id
  `, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    
    res.json({ success: true, data: rows });
  });
};