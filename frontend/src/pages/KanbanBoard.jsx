import { useEffect, useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Filter } from 'lucide-react';
import TaskCard from '../components/Kanban/TaskCard';
import { tasksAPI, developersAPI } from '../services/api';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'from-gray-500 to-gray-600' },
    { id: 'todo', title: 'To Do', color: 'from-blue-500 to-blue-600' },
    { id: 'in-progress', title: 'In Progress', color: 'from-yellow-500 to-orange-500' },
    { id: 'review', title: 'Code Review', color: 'from-purple-500 to-pink-500' },
    { id: 'testing', title: 'Testing', color: 'from-indigo-500 to-purple-500' },
    { id: 'done', title: 'Done', color: 'from-green-500 to-emerald-500' },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, devsRes] = await Promise.all([
        tasksAPI.getAll(),
        developersAPI.getAll(),
      ]);
      setTasks(tasksRes.data.data);
      setDevelopers(devsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    // Check if dropping on a column
    const isColumn = columns.some(col => col.id === newStatus);
    
    if (isColumn) {
      try {
        await tasksAPI.updateStatus(taskId, newStatus);
        
        // Update local state
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }

    setActiveTask(null);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 loading-dots">Loading Kanban Board</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 gradient-text">
              Kanban Board
            </h1>
            <p className="text-gray-400">Drag and drop tasks to update their status</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white hover:bg-dark-hover transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-lg btn-glow">
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column.id);
              
              return (
                <div
                  key={column.id}
                  className="bg-dark-card rounded-xl p-4 border border-dark-border min-h-[500px]"
                >
                  {/* Column Header */}
                  <div className="mb-4">
                    <div className={`h-1 w-12 bg-gradient-to-r ${column.color} rounded-full mb-3`}></div>
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-white text-sm">{column.title}</h2>
                      <span className="text-xs text-gray-400 bg-dark-hover px-2 py-1 rounded">
                        {columnTasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Droppable Area */}
                  <SortableContext
                    id={column.id}
                    items={columnTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {columnTasks.map((task) => (
                        <TaskCard key={task.id} task={task} developers={developers} />
                      ))}
                    </div>
                  </SortableContext>

                  {/* Empty State */}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      Drop tasks here
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 scale-105 opacity-90">
                <TaskCard task={activeTask} developers={developers} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Sprint Info */}
        <div className="mt-8 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 rounded-xl p-6 border border-accent-blue/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Sprint 5</h3>
              <p className="text-gray-400">Nov 20 - Dec 3, 2025</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-accent-blue mb-1">
                {tasks.filter(t => t.status === 'done').length}/{tasks.length}
              </p>
              <p className="text-sm text-gray-400">Tasks Completed</p>
            </div>
          </div>
          <div className="mt-4 w-full bg-dark-border rounded-full h-3">
            <div
              className="bg-gradient-to-r from-accent-blue to-accent-purple h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(tasks.filter(t => t.status === 'done').length / tasks.length) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;