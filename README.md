# 🌟 DevFlow - Developer Workflow Management

DevFlow is a full-stack application designed to streamline developer workflows, manage tasks, and provide insightful analytics for team performance.

![DevFlow Demo](media/frontend%20and%201%20more%20page%20-%20Profile%201%20-%20Microsoft%E2%80%8B%20Edge%202025-11-28%2022-49-45.mp4)

---

## 🚀 Features

- **Task Management**: Create, assign, and track tasks with a Kanban board.
- **Developer Insights**: View developer stats, contributions, and performance.
- **Team Analytics**: Gain insights into team velocity, bottlenecks, and task distribution.
- **Interactive UI**: Drag-and-drop functionality, real-time updates, and beautiful charts.

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express**: RESTful API
- **SQLite**: Lightweight database
- **dotenv**: Environment configuration
- **CORS**: Cross-origin resource sharing

### Frontend
- **React** + **Vite**: Modern UI framework and build tool
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization
- **DnD Kit**: Drag-and-drop interactions
- **Axios**: API communication

---

## 📂 Project Structure

```
devflow/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── config/
│   │   └── middleware/
│   └── devflow.db    # SQLite database
├── frontend/         # React + Vite application
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
└── README.md
```

---

## ⚙️ Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the backend server:
   ```powershell
   npm run dev
   ```
   The backend API will run on **http://localhost:5000**

### Frontend Setup

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the frontend development server:
   ```powershell
   npm run dev
   ```
   The frontend will run on **http://localhost:3000**

---

## 🌐 API Endpoints

### Developers
- `GET /api/developers` - Fetch all developers
- `POST /api/developers` - Add a new developer
- `GET /api/developers/:id` - Fetch developer details
- `PUT /api/developers/:id` - Update developer info
- `DELETE /api/developers/:id` - Remove a developer

### Tasks
- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete a task

### Analytics
- `GET /api/analytics/team` - Team performance metrics
- `GET /api/analytics/velocity` - Sprint velocity data

---

## 📊 Database Schema

- **Developers**: Stores developer information and stats.
- **Tasks**: Tracks task details and assignments.
- **Task History**: Logs task updates and changes.

---

## 🖼️ Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Preview)

### Kanban Board
![Kanban Board](https://via.placeholder.com/800x400?text=Kanban+Board+Preview)

---

## 🧰 Troubleshooting

### Common Issues

1. **Port Conflicts**:
   - Check if ports 5000 (backend) or 3000 (frontend) are in use:
     ```powershell
     Get-NetTCPConnection -LocalPort 5000 | Select-Object -Property OwningProcess
     ```
   - Kill the process using the port:
     ```powershell
     Stop-Process -Id <PID> -Force
     ```

2. **Database Reset**:
   - Delete `backend/devflow.db` and restart the backend server to recreate the database.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 🌟 Acknowledgments

- Icons by [Lucide React](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- Drag-and-drop by [DnD Kit](https://dndkit.com/)

---

Made with ❤️ by [Shivapython](https://github.com/Shivapython)