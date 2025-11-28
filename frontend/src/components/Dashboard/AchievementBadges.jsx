import { Award, Zap, Target, Trophy, Star, Flame } from 'lucide-react';

const AchievementBadges = () => {
  const badges = [
    {
      id: 1,
      name: 'Bug Hunter',
      description: 'Fixed 50+ bugs',
      icon: Target,
      color: 'from-red-500 to-orange-500',
      unlocked: true,
    },
    {
      id: 2,
      name: 'Sprint Champion',
      description: 'Completed 3 sprints perfectly',
      icon: Trophy,
      color: 'from-yellow-500 to-amber-500',
      unlocked: true,
    },
    {
      id: 3,
      name: 'Code Reviewer',
      description: 'Reviewed 100+ PRs',
      icon: Star,
      color: 'from-blue-500 to-cyan-500',
      unlocked: true,
    },
    {
      id: 4,
      name: 'Fast Coder',
      description: 'Complete tasks 2x faster',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      unlocked: false,
    },
    {
      id: 5,
      name: 'Streak Master',
      description: '30 day coding streak',
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      unlocked: false,
    },
    {
      id: 6,
      name: 'Team Player',
      description: 'Helped 20+ teammates',
      icon: Award,
      color: 'from-green-500 to-emerald-500',
      unlocked: false,
    },
  ];

  return (
    <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
      <h2 className="text-xl font-bold text-white mb-6">Achievement Badges</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`relative p-4 rounded-lg border border-dark-border transition-all duration-300 ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-dark-hover to-dark-card cursor-pointer hover:scale-105 hover:border-accent-blue'
                  : 'bg-dark-hover opacity-50 cursor-not-allowed'
              }`}
            >
              {badge.unlocked && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                </div>
              )}
              
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-3 ${
                  badge.unlocked ? 'shadow-lg' : 'grayscale'
                }`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className={`font-semibold mb-1 ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>
                {badge.name}
              </h3>
              <p className="text-xs text-gray-400">{badge.description}</p>
              
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-card/50 rounded-lg backdrop-blur-sm">
                  <span className="text-xs font-semibold text-gray-400">🔒 Locked</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 rounded-lg border border-accent-blue/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Progress to next badge</p>
            <p className="font-semibold text-white">Fast Coder - 78% Complete</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent-blue">78%</p>
          </div>
        </div>
        <div className="mt-3 w-full bg-dark-border rounded-full h-2">
          <div className="bg-gradient-to-r from-accent-blue to-accent-purple h-2 rounded-full" style={{ width: '78%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AchievementBadges;