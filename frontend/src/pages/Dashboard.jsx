import { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import ContributionHeatmap from '../components/Dashboard/ContributionHeatmap';
import AchievementBadges from '../components/Dashboard/AchievementBadges';
import RecentTasks from '../components/Dashboard/RecentTasks';
import { analyticsAPI, tasksAPI } from '../services/api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, tasksRes] = await Promise.all([
        analyticsAPI.getTeamMetrics(),
        tasksAPI.getAll(),
      ]);
      
      setMetrics(metricsRes.data.data);
      setRecentTasks(tasksRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 loading-dots">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-400">Here's what's happening with your projects today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tasks"
            value={metrics?.overview.total_tasks || 0}
            icon={CheckCircle}
            trend="up"
            trendValue="+12%"
            color="blue"
          />
          <StatCard
            title="Completed"
            value={metrics?.overview.completed_tasks || 0}
            icon={CheckCircle}
            trend="up"
            trendValue="+8%"
            color="green"
          />
          <StatCard
            title="In Progress"
            value={metrics?.overview.in_progress_tasks || 0}
            icon={Clock}
            color="yellow"
          />
          <StatCard
            title="Team Members"
            value={metrics?.overview.total_developers || 0}
            icon={Users}
            trend="up"
            trendValue="+1"
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <ContributionHeatmap />
            <RecentTasks tasks={recentTasks} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <AchievementBadges />
            
            {/* Quick Stats */}
            <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
              <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Completion Rate</span>
                  <span className="text-accent-green font-bold">
                    {metrics?.overview.completion_rate}%
                  </span>
                </div>
                <div className="w-full bg-dark-border rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-accent-green to-green-600 h-2 rounded-full"
                    style={{ width: `${metrics?.overview.completion_rate}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-400">Avg. Completion Time</span>
                  <span className="text-accent-blue font-bold">
                    {metrics?.performance.avg_completion_time?.toFixed(1) || 0}h
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Hours Logged</span>
                  <span className="text-accent-purple font-bold">
                    {metrics?.performance.total_hours_logged || 0}h
                  </span>
                </div>
              </div>
            </div>

            {/* Bottleneck Alert */}
            <div className="bg-gradient-to-br from-accent-red/20 to-orange-500/20 rounded-xl p-6 border border-accent-red/30">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-accent-red flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white mb-2">Attention Needed</h3>
                  <p className="text-sm text-gray-300">
                    2 tasks have been in review for more than 48 hours
                  </p>
                  <button className="mt-3 px-4 py-2 bg-accent-red text-white rounded-lg text-sm font-medium hover:bg-accent-red/80 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;