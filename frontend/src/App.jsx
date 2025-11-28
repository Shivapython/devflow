import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import Developers from './pages/Developers';
import Analytics from './pages/Analytics';
import FocusMode from './pages/FocusMode';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/focus" element={<FocusMode />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;