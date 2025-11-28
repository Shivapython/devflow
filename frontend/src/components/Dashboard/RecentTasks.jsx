import { Clock, CheckCircle2, AlertCircle, Code } from 'lucide-react';

const RecentTasks = ({ tasks = [] }) => {
  const getStatusColor = (status) => {
    const colors = {
      'done': 'text-accent-green bg-accent-green/20',
      'in-progress': 'text-accent-blue bg-accent-blue/20',
      'review': 'text-accent-yellow bg-accent-yellow/20',
      'testing': 'text-accent-purple bg-accent-purple/20',
      'todo': 'text-gray-400 bg-gray-400/20',
      'backlog': 'text-gray-500 bg-gray-500/20',
    };
    return colors[status] || colors.todo;
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'high') return <AlertCircle className="w-4 h-4 text-accent-red" />;
    if (priority === 'medium') return <Clock className="w-4 h-4 text-accent-yellow" />;
    return <CheckCircle2 className="w-4 h-4 text-accent-green" />;
  };

  return (
    <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Recent Tasks</h2>
        <button className="text-sm text-accent-blue hover:text-accent-blue/80 font-medium">
          View All →
        </button>
      </div>

      <div className="space-y-3">
        {tasks.slice(0, 5).map((task) => (
          <div
            key={task.id}
            className="p-4 bg-dark-hover rounded-lg border border-dark-border hover:border-accent-blue/50 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getPriorityIcon(task.priority)}
                  <h3 className="font-semibold text-white group-hover:text-accent-blue transition-colors">
                    {task.title}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {task.description}
                </p>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  
                  {task.tech_stack && task.tech_stack.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Code className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {task.tech_stack.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{task.estimated_hours}h est.</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <div className="flex">
                  {[...Array(task.difficulty || 3)].map((_, i) => (
                    <span key={i} className="text-accent-yellow">⭐</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-dark-hover rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400">No recent tasks</p>
        </div>
      )}
    </div>
  );
};

export default RecentTasks;