import { useState } from 'react';

const ContributionHeatmap = () => {
  // Generate random contribution data for the last 12 weeks
  const generateData = () => {
    const data = [];
    const today = new Date();
    
    for (let week = 0; week < 12; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + day));
        weekData.push({
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 10),
        });
      }
      data.push(weekData);
    }
    return data.reverse();
  };

  const [hoveredCell, setHoveredCell] = useState(null);
  const contributions = generateData();

  const getColor = (count) => {
    if (count === 0) return 'bg-dark-border';
    if (count <= 2) return 'bg-accent-green/30';
    if (count <= 5) return 'bg-accent-green/60';
    if (count <= 7) return 'bg-accent-green/80';
    return 'bg-accent-green';
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Contribution Activity</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-sm bg-dark-border"></div>
            <div className="w-3 h-3 rounded-sm bg-accent-green/30"></div>
            <div className="w-3 h-3 rounded-sm bg-accent-green/60"></div>
            <div className="w-3 h-3 rounded-sm bg-accent-green/80"></div>
            <div className="w-3 h-3 rounded-sm bg-accent-green"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex space-x-1">
          {contributions.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col space-y-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-4 h-4 rounded-sm ${getColor(day.count)} cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-accent-blue hover:scale-110`}
                  onMouseEnter={() => setHoveredCell(day)}
                  onMouseLeave={() => setHoveredCell(null)}
                  title={`${day.count} contributions on ${day.date}`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {hoveredCell && (
        <div className="mt-4 p-3 bg-dark-hover rounded-lg text-sm animate-fade-in">
          <p className="text-gray-400">
            <span className="font-semibold text-accent-blue">{hoveredCell.count} tasks</span> completed on {hoveredCell.date}
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-dark-hover rounded-lg">
          <p className="text-2xl font-bold text-accent-green">342</p>
          <p className="text-sm text-gray-400">Total Contributions</p>
        </div>
        <div className="text-center p-3 bg-dark-hover rounded-lg">
          <p className="text-2xl font-bold text-accent-blue">7 days</p>
          <p className="text-sm text-gray-400">Current Streak</p>
        </div>
      </div>
    </div>
  );
};

export default ContributionHeatmap;