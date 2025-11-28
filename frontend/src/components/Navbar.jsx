import { Link, useLocation } from 'react-router-dom';
import { Home, Kanban, Users, BarChart3, Timer, Code2 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/kanban', icon: Kanban, label: 'Kanban Board' },
    { path: '/developers', icon: Users, label: 'Developers' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/focus', icon: Timer, label: 'Focus Mode' },
  ];

  return (
    <nav className="bg-dark-card border-b border-dark-border sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-accent-blue to-accent-purple p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">DevFlow</span>
          </Link>

          {/* Navigation Items */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/50'
                      : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium hidden md:block">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple p-0.5 cursor-pointer hover:scale-110 transition-transform avatar-pulse">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                  alt="User"
                  className="w-full h-full rounded-full bg-dark-card"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent-green rounded-full border-2 border-dark-card"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;