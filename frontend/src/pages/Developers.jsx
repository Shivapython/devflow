import { useEffect, useState } from 'react';
import { Award, Code, TrendingUp, Flame } from 'lucide-react';
import { developersAPI } from '../services/api';

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const response = await developersAPI.getAll();
      setDevelopers(response.data.data);
    } catch (error) {
      console.error('Error fetching developers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      Frontend: 'from-blue-500 to-cyan-500',
      Backend: 'from-green-500 to-emerald-500',
      Fullstack: 'from-purple-500 to-pink-500',
      DevOps: 'from-orange-500 to-red-500',
    };
    return colors[role] || colors.Fullstack;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 loading-dots">Loading Developers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 gradient-text">
            Team Developers
          </h1>
          <p className="text-gray-400">Meet our talented development team</p>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev, index) => (
            <div
              key={dev.id}
              className="bg-dark-card rounded-xl p-6 border border-dark-border card-hover shine animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getRoleColor(dev.role)} p-1`}>
                    <img
                      src={dev.avatar_url}
                      alt={dev.name}
                      className="w-full h-full rounded-full bg-dark-bg"
                    />
                  </div>
                  {dev.current_streak > 0 && (
                    <div className="absolute -bottom-2 -right-2 bg-accent-red rounded-full p-2 border-2 border-dark-card">
                      <Flame className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{dev.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{dev.email}</p>
                <span className={`inline-block px-3 py-1 bg-gradient-to-r ${getRoleColor(dev.role)} text-white text-sm font-medium rounded-full`}>
                  {dev.role} Developer
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-dark-hover rounded-lg">
                  <p className="text-2xl font-bold text-accent-blue">{dev.total_tasks_completed}</p>
                  <p className="text-xs text-gray-400 mt-1">Tasks</p>
                </div>
                <div className="text-center p-3 bg-dark-hover rounded-lg">
                  <p className="text-2xl font-bold text-accent-green">{dev.current_streak}</p>
                  <p className="text-xs text-gray-400 mt-1">Streak</p>
                </div>
                <div className="text-center p-3 bg-dark-hover rounded-lg">
                  <p className="text-2xl font-bold text-accent-purple">{dev.focus_time_today}m</p>
                  <p className="text-xs text-gray-400 mt-1">Focus</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-4 h-4 text-accent-blue" />
                  <h4 className="font-semibold text-white text-sm">Top Skills</h4>
                </div>
                <div className="space-y-2">
                  {Object.entries(dev.skills).slice(0, 3).map(([skill, level]) => (
                    <div key={skill}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400 capitalize">{skill}</span>
                        <span className="text-accent-blue font-semibold">{level}/10</span>
                      </div>
                      <div className="w-full bg-dark-border rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-accent-blue to-accent-purple h-2 rounded-full transition-all duration-500"
                          style={{ width: `${level * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges */}
              {dev.achievement_badges.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Award className="w-4 h-4 text-accent-yellow" />
                    <h4 className="font-semibold text-white text-sm">Achievements</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dev.achievement_badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gradient-to-r from-accent-yellow/20 to-orange-500/20 text-accent-yellow text-xs rounded border border-accent-yellow/30"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* View Profile Button */}
              <button className="w-full mt-6 py-2 bg-dark-hover border border-dark-border text-white rounded-lg hover:bg-dark-border hover:border-accent-blue transition-all duration-300 font-medium text-sm">
                View Full Profile
              </button>
            </div>
          ))}
        </div>

        {/* Add New Developer Card */}
        <div className="mt-6 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 rounded-xl p-8 border border-accent-blue/30 text-center">
          <TrendingUp className="w-12 h-12 text-accent-blue mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Growing Team</h3>
          <p className="text-gray-400 mb-4">Want to add a new developer to the team?</p>
          <button className="px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-lg btn-glow font-medium">
            Add New Developer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Developers;