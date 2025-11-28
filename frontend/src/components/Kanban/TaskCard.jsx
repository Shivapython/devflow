import { useState } from 'react';
import { Clock, Code, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, developers }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-l-accent-red',
      medium: 'border-l-accent-yellow',
      low: 'border-l-accent-green',
    };
    return colors[priority] || colors.medium;
  };

  const assignedDev = developers.find(d => d.id === task.assigned_to);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-dark-card rounded-lg border-l-4 ${getPriorityColor(task.priority)} border-r border-t border-b border-dark-border p-4 mb-3 cursor-grab active:cursor-grabbing hover:border-accent-blue/50 transition-all duration-300 group shine`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white group-hover:text-accent-blue transition-colors flex-1 pr-2">
          {task.title}
        </h3>
        <div className="flex">
          {[...Array(task.difficulty || 3)].map((_, i) => (
            <span key={i} className="text-accent-yellow text-xs">⭐</span>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Tech Stack Tags */}
      {task.tech_stack && task.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {task.tech_stack.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-dark-hover text-accent-blue text-xs rounded-md border border-accent-blue/30"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Expandable Code Snippet */}
      {task.code_snippet && (
        <div className="mb-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-accent-blue transition-colors"
          >
            <Code className="w-3 h-3" />
            <span>Code Preview</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          
          {isExpanded && (
            <div className="mt-2 p-2 bg-dark-bg rounded text-xs text-gray-300 font-mono overflow-x-auto animate-slide-down">
              <pre>{task.code_snippet}</pre>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{task.estimated_hours}h</span>
          </div>
          
          {task.priority === 'high' && (
            <span className="px-2 py-0.5 bg-accent-red/20 text-accent-red rounded">
              High Priority
            </span>
          )}
        </div>

        {assignedDev && (
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <img
              src={assignedDev.avatar_url}
              alt={assignedDev.name}
              className="w-6 h-6 rounded-full border-2 border-accent-blue"
              title={assignedDev.name}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;