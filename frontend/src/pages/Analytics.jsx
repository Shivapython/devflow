import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, AlertTriangle } from 'lucide-react';
import { analyticsAPI } from '../services/api';

const Analytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [velocity, setVelocity] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [bottlenecks, setBottlenecks] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#58A6FF', '#3FB950', '#F85149', '#D29922', '#BC8CFF'];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [metricsRes, velocityRes, leaderboardRes, bottlenecksRes] = await Promise.all([
        analyticsAPI.getTeamMetrics(),
        analyticsAPI.getVelocity(),
        analyticsAPI.getLeaderboard(),
        analyticsAPI.getBottlenecks(),
      ]);

      setMetrics(metricsRes.data.data);
      setVelocity(velocityRes.data.data);
      setLeaderboard(leaderboardRes.data.data);
      setBottlenecks(bottlenecksRes.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 loading-dots">Loading Analytics</p>
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
            Analytics Dashboard
          </h1>
          <p className="text-gray-400">Insights into team performance and productivity</p>
        </div>

        {/* Velocity Chart */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-accent-blue" />
            <span>Sprint Velocity</span>
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={velocity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis 
                dataKey="sprint_number" 
                stroke="#C9D1D9"
                label={{ value: 'Sprint', position: 'insideBottom', offset: -5, fill: '#C9D1D9' }}
              />
              <YAxis stroke="#C9D1D9" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#161B22', 
                  border: '1px solid #30363D',
                  borderRadius: '8px',
                  color: '#C9D1D9'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="story_points_completed" 
                stroke="#58A6FF" 
                strokeWidth={3}
                name="Story Points"
                dot={{ fill: '#58A6FF', r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="completed_tasks" 
                stroke="#3FB950" 
                strokeWidth={3}
                name="Tasks Completed"
                dot={{ fill: '#3FB950', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tasks by Status Pie Chart */}
          <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
            <h2 className="text-xl font-bold text-white mb-6">Tasks by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics?.tasks_by_status || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.status}: ${entry.count}`}
                >
                  {(metrics?.tasks_by_status || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#161B22', 
                    border: '1px solid #30363D',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tasks by Priority Bar Chart */}
          <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
            <h2 className="text-xl font-bold text-white mb-6">Tasks by Priority</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics?.tasks_by_priority || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="priority" stroke="#C9D1D9" />
                <YAxis stroke="#C9D1D9" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#161B22', 
                    border: '1px solid #30363D',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#58A6FF" radius={[8, 8, 0, 0]}>
                  {(metrics?.tasks_by_priority || []).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.priority === 'high' ? '#F85149' : entry.priority === 'medium' ? '#D29922' : '#3FB950'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Award className="w-5 h-5 text-accent-yellow" />
            <span>Developer Leaderboard</span>
          </h2>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((dev, index) => (
              <div
                key={dev.id}
                className="flex items-center justify-between p-4 bg-dark-hover rounded-lg border border-dark-border hover:border-accent-blue/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className={`text-2xl font-bold ${
                    index === 0 ? 'text-accent-yellow' : 
                    index === 1 ? 'text-gray-400' : 
                    index === 2 ? 'text-orange-500' : 'text-gray-500'
                  }`}>
                    #{dev.rank}
                  </div>
                  <img
                    src={dev.avatar_url}
                    alt={dev.name}
                    className="w-12 h-12 rounded-full border-2 border-accent-blue"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{dev.name}</h3>
                    <p className="text-sm text-gray-400">{dev.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-accent-blue">{dev.total_tasks_completed}</p>
                    <p className="text-xs text-gray-400">Tasks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent-green">{dev.current_streak}</p>
                    <p className="text-xs text-gray-400">Streak</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent-purple">{dev.active_tasks}</p>
                    <p className="text-xs text-gray-400">Active</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottlenecks Alert */}
        {bottlenecks.length > 0 && (
          <div className="bg-gradient-to-br from-accent-red/20 to-orange-500/20 rounded-xl p-6 border border-accent-red/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-accent-red" />
              <span>Bottlenecks Detected</span>
            </h2>
            <p className="text-gray-300 mb-4">
              {bottlenecks.length} task(s) have been stuck in review/testing for more than 2 days
            </p>
            <div className="space-y-2">
              {bottlenecks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-dark-card rounded-lg border border-accent-red/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{task.title}</h3>
                      <p className="text-sm text-gray-400">
                        Assigned to: {task.developer_name || 'Unassigned'}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-accent-red/20 text-accent-red rounded text-sm font-medium">
                      {task.days_stuck} days stuck
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;