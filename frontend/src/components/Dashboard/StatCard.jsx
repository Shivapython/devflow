import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-accent-blue to-blue-600',
    green: 'from-accent-green to-green-600',
    purple: 'from-accent-purple to-purple-600',
    yellow: 'from-accent-yellow to-yellow-600',
  };

  return (
    <div className="bg-dark-card rounded-xl p-6 border border-dark-border card-hover shine relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full blur-3xl`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} bg-opacity-20`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 text-sm ${trend === 'up' ? 'text-accent-green' : 'text-accent-red'}`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-semibold">{trendValue}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;