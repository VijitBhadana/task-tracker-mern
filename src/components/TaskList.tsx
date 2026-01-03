import { Task } from '../types/task';
import TaskCard from './TaskCard';
import { ListTodo, Filter } from 'lucide-react';
import { useState } from 'react';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

type FilterType = 'all' | 'pending' | 'completed';

export default function TaskList({ tasks, onDelete, onEdit, onToggleStatus }: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return task.status === 'Pending';
    if (filter === 'completed') return task.status === 'Completed';
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'Pending' ? -1 : 1;
    }
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <span className="font-medium text-gray-700">Filter:</span>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setFilter('all')}>
              All ({tasks.length})
            </button>
            <button onClick={() => setFilter('pending')}>
              Pending ({pendingCount})
            </button>
            <button onClick={() => setFilter('completed')}>
              Completed ({completedCount})
            </button>
          </div>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <ListTodo size={48} className="mx-auto text-gray-400 mb-4" />
          <h3>No tasks</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
