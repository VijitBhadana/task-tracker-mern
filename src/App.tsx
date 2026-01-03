import { useEffect, useState } from 'react';
import { Task, TaskFormData } from './types/task';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { CheckSquare, Plus, X } from 'lucide-react';

// 🔹 Backend API base URL
const API_URL = import.meta.env.VITE_API_URL;


function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 GET all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 CREATE task
  const createTask = async (taskData: TaskFormData) => {
    try {
      setError(null);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) throw new Error('Create failed');

      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
    } catch (err) {
      console.error(err);
      setError('Failed to create task.');
      throw err;
    }
  };

  // 🔹 UPDATE task (edit)
  const updateTask = async (taskData: TaskFormData) => {
    if (!editingTask) return;

    try {
      setError(null);

      const res = await fetch(`${API_URL}/${editingTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) throw new Error('Update failed');

      const updatedTask = await res.json();

      setTasks(tasks.map(t => (t._id === updatedTask._id ? updatedTask : t)));
      setEditingTask(null);
      setShowForm(true);
    } catch (err) {
      console.error(err);
      setError('Failed to update task.');
      throw err;
    }
  };

  // 🔹 DELETE task
  const deleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      setError(null);

      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete task.');
    }
  };

  // 🔹 TOGGLE status
  const toggleTaskStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';

    try {
      setError(null);

      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Toggle failed');

      const updatedTask = await res.json();

      setTasks(tasks.map(task => (task._id === id ? updatedTask : task)));
    } catch (err) {
      console.error(err);
      setError('Failed to update task status.');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckSquare size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Task Tracker</h1>
          </div>
          <p className="text-gray-600">Organize your daily tasks efficiently</p>
        </header>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <X size={20} />
            </button>
          </div>
        )}

        {!showForm && !editingTask && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 bg-white py-4 rounded-lg shadow flex justify-center gap-2"
          >
            <Plus size={24} />
            Create New Task
          </button>
        )}

        {showForm && !editingTask && (
          <TaskForm
            onSubmit={createTask}
            onCancel={tasks.length > 0 ? () => setShowForm(false) : undefined}
          />
        )}

        {editingTask && (
          <TaskForm
            onSubmit={updateTask}
            onCancel={handleCancelEdit}
            initialData={editingTask}
            isEditing
          />
        )}

        <TaskList
          tasks={tasks}
          onDelete={deleteTask}
          onEdit={handleEditTask}
          onToggleStatus={toggleTaskStatus}
        />
      </div>
    </div>
  );
}

export default App;
