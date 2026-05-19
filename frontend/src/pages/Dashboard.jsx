import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import api from '../api';

import { Header } from '../components/Header';
import { DevOpsMetrics } from '../components/DevOpsMetrics';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { KanbanBoard } from '../components/KanbanBoard';
import { RecentActivity } from '../components/RecentActivity';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'Medium', dueDate: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchTasks();
    }
  }, [navigate, user]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      // Normalize 'To Do' to 'Todo' for the Kanban
      const normalizedTasks = response.data.map(t => ({
        ...t,
        status: t.status === 'To Do' ? 'Todo' : t.status
      }));
      setTasks(normalizedTasks);
    } catch (error) {
      if (error.response?.status === 401) onLogout();
    }
  };

  const onLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post('/tasks', formData);
      }
      setFormData({ title: '', description: '', priority: 'Medium', dueDate: '' });
      setIsFormOpen(false);
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving task');
    }
  };

  const onEdit = (task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority || 'Medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setIsFormOpen(true);
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;
    
    // Optimistic Update
    const taskIndex = tasks.findIndex(t => t._id === draggableId);
    const newTasks = [...tasks];
    newTasks[taskIndex].status = newStatus;
    setTasks(newTasks);

    try {
      const apiStatus = newStatus === 'Todo' ? 'To Do' : newStatus;
      await api.put(`/tasks/${draggableId}`, { status: apiStatus });
      // Re-fetch to ensure sync
      fetchTasks();
    } catch (error) {
      console.error(error);
      fetchTasks(); // Revert on failure
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">System Overview</h2>
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ title: '', description: '', priority: 'Medium', dueDate: '' });
              setIsFormOpen(true);
            }} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-lg shadow-blue-500/30"
          >
            <Plus size={18} /> New Task
          </button>
        </div>

        <DevOpsMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <AnalyticsDashboard tasks={tasks} />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity tasks={tasks} />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Task Board</h2>
          <KanbanBoard 
            tasks={tasks} 
            onDragEnd={onDragEnd} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        </div>

        {/* Modal for Creating/Editing Tasks */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  {editingId ? 'Edit Task' : 'Deploy New Task'}
                </h3>
                <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={onSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Title</label>
                  <input
                    type="text" name="title" value={formData.title} onChange={onChange}
                    required placeholder="e.g. Optimize Database Indexes"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={onChange}
                    required rows="3" placeholder="Task details..."
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Priority</label>
                    <select
                      name="priority" value={formData.priority} onChange={onChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Due Date</label>
                    <input
                      type="date" name="dueDate" value={formData.dueDate} onChange={onChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="submit" className="flex-1 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                    {editingId ? 'Update Task' : 'Create Task'}
                  </button>
                  <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-2.5 font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
