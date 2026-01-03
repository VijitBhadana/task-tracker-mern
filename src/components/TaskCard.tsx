import { Task } from '../types/task';
import { Calendar, Flag, Trash2, Edit2, CheckCircle, Circle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export default function TaskCard({ task, onDelete, onEdit, onToggleStatus }: TaskCardProps) {
  const priorityColors = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusColors = {
    Pending: 'bg-blue-100 text-blue-800 border-blue-200',
    Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = () => {
    const dueDate = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && task.status === 'Pending';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border-l-4 ${
        task.status === 'Completed'
          ? 'border-emerald-500'
          : isOverdue()
          ? 'border-red-500'
          : 'border-blue-500'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold text-gray-800 mb-1 ${
              task.status === 'Completed' ? 'line-through text-gray-500' : ''
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          )}
        </div>

        <button
          onClick={() => onToggleStatus(task._id, task.status)}
          className="ml-3 text-gray-400 hover:text-emerald-600"
        >
          {task.status === 'Completed' ? (
            <CheckCircle size={24} className="text-emerald-600" fill="currentColor" />
          ) : (
            <Circle size={24} />
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}
        >
          <Flag size={12} className="mr-1" />
          {task.priority}
        </span>

        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[task.status]}`}
        >
          {task.status}
        </span>

        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
            isOverdue()
              ? 'bg-red-100 text-red-800 border-red-200'
              : 'bg-gray-100 text-gray-700 border-gray-200'
          }`}
        >
          <Calendar size={12} className="mr-1" />
          {formatDate(task.due_date)}
          {isOverdue() && ' (Overdue)'}
        </span>
      </div>

      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          <Edit2 size={16} /> Edit
        </button>

        <button
          onClick={() => onDelete(task._id)}
          className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}
