# 🌟 DevFlow - Developer Workflow Management

DevFlow is a full-stack application designed to streamline developer workflows, manage tasks, and provide insightful analytics for team performance.

https://github.com/user-attachments/assets/7d11b674-ec01-4590-93d2-6a23d443e86e

![Focus Mode Screenshot](attachments/focus-mode-screenshot.png)


---
## Screenshots

1️⃣ Last image (now first)
https://github.com/user-attachments/assets/2cd84c5a-76bd-46bb-b2b3-ffd41407b4f2

2️
https://github.com/user-attachments/assets/2b19053a-0409-4dcf-b89d-368dcca9c724

3️⃣
https://github.com/user-attachments/assets/944dc28d-f7d2-450d-ba39-abb11ab1b789

4️⃣
https://github.com/user-attachments/assets/6a628b83-60c9-44c7-8fda-0a83c89c65c2

5️⃣
https://github.com/user-attachments/assets/d59bee21-f5ba-4ea1-b15d-a8820cf2dad5

6️⃣
https://github.com/user-attachments/assets/b1bb12ff-2c2b-4812-8ac2-ffd46b8ca795

7️⃣ First image (now last)
https://github.com/user-attachments/assets/c5d9b656-48bc-43f6-8508-c9ec064328cb




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
