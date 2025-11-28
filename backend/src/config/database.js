const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../devflow.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Developers Table
  db.run(`
    CREATE TABLE IF NOT EXISTS developers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      avatar_url TEXT,
      role TEXT CHECK(role IN ('Frontend', 'Backend', 'Fullstack', 'DevOps')),
      skills TEXT,
      joined_date TEXT,
      total_tasks_completed INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 0,
      achievement_badges TEXT,
      focus_time_today INTEGER DEFAULT 0
    )
  `);

  // Tasks Table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT CHECK(status IN ('backlog', 'todo', 'in-progress', 'review', 'testing', 'done')) DEFAULT 'backlog',
      priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
      difficulty INTEGER CHECK(difficulty BETWEEN 1 AND 5) DEFAULT 3,
      tech_stack TEXT,
      assigned_to TEXT,
      created_by TEXT,
      created_at TEXT,
      updated_at TEXT,
      estimated_hours REAL,
      actual_hours REAL,
      due_date TEXT,
      code_snippet TEXT,
      sprint_number INTEGER,
      FOREIGN KEY (assigned_to) REFERENCES developers(id),
      FOREIGN KEY (created_by) REFERENCES developers(id)
    )
  `);

  // Task History Table
  db.run(`
    CREATE TABLE IF NOT EXISTS task_history (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      action TEXT NOT NULL,
      performed_by TEXT,
      timestamp TEXT,
      old_value TEXT,
      new_value TEXT,
      FOREIGN KEY (task_id) REFERENCES tasks(id),
      FOREIGN KEY (performed_by) REFERENCES developers(id)
    )
  `);

  // Code Reviews Table
  db.run(`
    CREATE TABLE IF NOT EXISTS code_reviews (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      reviewer_id TEXT NOT NULL,
      status TEXT CHECK(status IN ('pending', 'approved', 'changes_requested')) DEFAULT 'pending',
      comments TEXT,
      reviewed_at TEXT,
      FOREIGN KEY (task_id) REFERENCES tasks(id),
      FOREIGN KEY (reviewer_id) REFERENCES developers(id)
    )
  `, () => {
    console.log('✅ Database tables initialized');
    seedDatabase();
  });
}

function seedDatabase() {
  // Check if data already exists
  db.get('SELECT COUNT(*) as count FROM developers', (err, row) => {
    if (row.count === 0) {
      console.log('🌱 Seeding database with initial data...');
      
      const { v4: uuidv4 } = require('uuid');
      
      // Seed Developers
      const developers = [
        {
          id: uuidv4(),
          name: 'Alex Johnson',
          email: 'alex@devflow.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
          role: 'Fullstack',
          skills: JSON.stringify({ react: 9, nodejs: 8, python: 7, docker: 6 }),
          joined_date: '2024-01-15',
          total_tasks_completed: 45,
          current_streak: 7,
          achievement_badges: JSON.stringify(['Bug Hunter', 'Sprint Champion', 'Code Reviewer']),
          focus_time_today: 180
        },
        {
          id: uuidv4(),
          name: 'Sarah Chen',
          email: 'sarah@devflow.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          role: 'Frontend',
          skills: JSON.stringify({ react: 10, vue: 8, css: 9, typescript: 7 }),
          joined_date: '2024-02-01',
          total_tasks_completed: 38,
          current_streak: 5,
          achievement_badges: JSON.stringify(['UI Master', 'Fast Coder']),
          focus_time_today: 120
        },
        {
          id: uuidv4(),
          name: 'Marcus Williams',
          email: 'marcus@devflow.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
          role: 'Backend',
          skills: JSON.stringify({ nodejs: 9, python: 10, postgresql: 8, aws: 7 }),
          joined_date: '2024-01-20',
          total_tasks_completed: 52,
          current_streak: 10,
          achievement_badges: JSON.stringify(['API Architect', 'Database Wizard', 'Performance King']),
          focus_time_today: 200
        },
        {
          id: uuidv4(),
          name: 'Emily Rodriguez',
          email: 'emily@devflow.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
          role: 'DevOps',
          skills: JSON.stringify({ kubernetes: 9, docker: 10, jenkins: 8, terraform: 7 }),
          joined_date: '2024-03-01',
          total_tasks_completed: 30,
          current_streak: 3,
          achievement_badges: JSON.stringify(['Deploy Master', 'CI/CD Hero']),
          focus_time_today: 90
        }
      ];

      developers.forEach(dev => {
        db.run(`
          INSERT INTO developers (id, name, email, avatar_url, role, skills, joined_date, 
                                  total_tasks_completed, current_streak, achievement_badges, focus_time_today)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [dev.id, dev.name, dev.email, dev.avatar_url, dev.role, dev.skills, dev.joined_date,
            dev.total_tasks_completed, dev.current_streak, dev.achievement_badges, dev.focus_time_today]);
      });

      // Seed Tasks
      setTimeout(() => {
        db.all('SELECT id FROM developers', (err, devs) => {
          const tasks = [
            {
              id: uuidv4(),
              title: 'Implement User Authentication',
              description: 'Add JWT-based authentication with refresh tokens',
              status: 'in-progress',
              priority: 'high',
              difficulty: 4,
              tech_stack: JSON.stringify(['Node.js', 'JWT', 'bcrypt']),
              assigned_to: devs[2].id,
              created_by: devs[0].id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              estimated_hours: 16,
              actual_hours: 8,
              due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              code_snippet: 'const jwt = require("jsonwebtoken");\nconst token = jwt.sign(payload, secret);',
              sprint_number: 5
            },
            {
              id: uuidv4(),
              title: 'Design Dashboard UI',
              description: 'Create responsive dashboard with analytics widgets',
              status: 'review',
              priority: 'high',
              difficulty: 3,
              tech_stack: JSON.stringify(['React', 'Tailwind', 'Recharts']),
              assigned_to: devs[1].id,
              created_by: devs[0].id,
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
              estimated_hours: 12,
              actual_hours: 10,
              due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
              code_snippet: 'const Dashboard = () => {\n  return <div className="grid grid-cols-3">...</div>\n}',
              sprint_number: 5
            },
            {
              id: uuidv4(),
              title: 'Setup CI/CD Pipeline',
              description: 'Configure GitHub Actions for automated testing and deployment',
              status: 'todo',
              priority: 'medium',
              difficulty: 4,
              tech_stack: JSON.stringify(['GitHub Actions', 'Docker', 'AWS']),
              assigned_to: devs[3].id,
              created_by: devs[0].id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              estimated_hours: 20,
              actual_hours: 0,
              due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              code_snippet: 'name: CI/CD\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest',
              sprint_number: 5
            },
            {
              id: uuidv4(),
              title: 'Optimize Database Queries',
              description: 'Add indexes and optimize slow queries',
              status: 'backlog',
              priority: 'medium',
              difficulty: 3,
              tech_stack: JSON.stringify(['PostgreSQL', 'SQL']),
              assigned_to: devs[2].id,
              created_by: devs[0].id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              estimated_hours: 8,
              actual_hours: 0,
              due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              code_snippet: 'CREATE INDEX idx_user_email ON users(email);',
              sprint_number: 6
            },
            {
              id: uuidv4(),
              title: 'Fix Mobile Responsive Issues',
              description: 'Fix layout issues on mobile devices',
              status: 'testing',
              priority: 'high',
              difficulty: 2,
              tech_stack: JSON.stringify(['CSS', 'Tailwind']),
              assigned_to: devs[1].id,
              created_by: devs[0].id,
              created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
              estimated_hours: 4,
              actual_hours: 3,
              due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
              code_snippet: '@media (max-width: 768px) {\n  .container { padding: 1rem; }\n}',
              sprint_number: 5
            },
            {
              id: uuidv4(),
              title: 'Implement Real-time Notifications',
              description: 'Add WebSocket support for real-time updates',
              status: 'done',
              priority: 'medium',
              difficulty: 5,
              tech_stack: JSON.stringify(['WebSocket', 'Socket.io', 'Redis']),
              assigned_to: devs[0].id,
              created_by: devs[0].id,
              created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              estimated_hours: 24,
              actual_hours: 22,
              due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              code_snippet: 'io.on("connection", (socket) => {\n  socket.emit("notification", data);\n});',
              sprint_number: 4
            }
          ];

          tasks.forEach(task => {
            db.run(`
              INSERT INTO tasks (id, title, description, status, priority, difficulty, tech_stack,
                                assigned_to, created_by, created_at, updated_at, estimated_hours,
                                actual_hours, due_date, code_snippet, sprint_number)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [task.id, task.title, task.description, task.status, task.priority, task.difficulty,
                task.tech_stack, task.assigned_to, task.created_by, task.created_at, task.updated_at,
                task.estimated_hours, task.actual_hours, task.due_date, task.code_snippet, task.sprint_number]);
          });

          console.log('✅ Database seeded successfully!');
        });
      }, 100);
    }
  });
}

module.exports = db;