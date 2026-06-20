import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Calendar, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  }, [navigate]);

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
      fetchTasks();
    } catch (error) {
      console.error(error);
      fetchTasks(); // Revert on failure
    }
  };

  // Capitalize name
  const capitalizedName = user?.name ? user.name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ') : 'Workspace User';

  // Get dynamic greeting based on local time hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Dynamically compute welcome stats
  const activeTasks = tasks.filter(t => t.status !== 'Completed').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  
  const isDueToday = (dueDateStr) => {
    if (!dueDateStr) return false;
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(dueDateStr).toISOString().split('T')[0];
    return today === dueDate;
  };
  const dueToday = tasks.filter(t => t.status !== 'Completed' && isDueToday(t.dueDate)).length;
  
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans transition-colors duration-300">
      <Header user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Hero Banner Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          {/* Subtle glow layer */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
          
          <div className="space-y-2 relative">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {getGreeting()}, {capitalizedName}
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              You have <span className="text-indigo-400 font-bold">{activeTasks}</span> active tasks. 
              {dueToday > 0 ? (
                <> <span className="text-amber-400 font-bold">{dueToday}</span> due today.</>
              ) : (
                ' None due today.'
              )} All system integrations are running normally.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 relative">
            {/* Completion Gauge Indicator */}
            {totalTasks > 0 && (
              <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-xl">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle cx="20" cy="20" r="16" stroke="rgba(30, 41, 59, 1)" strokeWidth="3" fill="transparent" />
                    <circle cx="20" cy="20" r="16" stroke="rgba(99, 102, 241, 1)" strokeWidth="3" fill="transparent"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={2 * Math.PI * 16 * (1 - completionRate / 100)}
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-white">{completionRate}%</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completion</p>
                  <p className="text-xs font-semibold text-slate-350">{completedTasks}/{totalTasks} Resolved</p>
                </div>
              </div>
            )}

            {/* CTA action */}
            <button 
              onClick={() => {
                setEditingId(null);
                setFormData({ title: '', description: '', priority: 'Medium', dueDate: '' });
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] shadow-md shadow-indigo-500/10 active:scale-[0.98]"
            >
              <Plus size={16} /> New Task
            </button>
          </div>
        </motion.div>

        {/* Unified Dashboard Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main workspace section */}
          <div className="lg:col-span-3 space-y-8">
            {/* Kanban Board Container */}
            <div className="bg-slate-900/40 border border-slate-900 p-5 md:p-6 rounded-2xl shadow-sm">
              <div className="mb-6">
                <h3 className="text-base font-bold text-white">Task Board</h3>
                <p className="text-xs text-slate-400 mt-1">Organize and coordinate your backlog and workflow.</p>
              </div>
              <KanbanBoard 
                tasks={tasks} 
                onDragEnd={onDragEnd} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            </div>

            {/* Analytics Section */}
            <div className="bg-slate-900/40 border border-slate-900 p-5 md:p-6 rounded-2xl shadow-sm">
              <div className="mb-6">
                <h3 className="text-base font-bold text-white">Workspace Analytics</h3>
                <p className="text-xs text-slate-400 mt-1">Review visual metrics and breakdowns of workspace metrics.</p>
              </div>
              <AnalyticsDashboard tasks={tasks} />
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-1 space-y-8">
            {/* System Health */}
            <DevOpsMetrics />

            {/* Recent Activity */}
            <RecentActivity tasks={tasks} />
          </div>
        </div>

        {/* Accessible Task creation modal */}
        <AnimatePresence>
          {isFormOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              >
                <div className="flex justify-between items-center p-5 border-b border-slate-850">
                  <h3 className="text-base font-bold text-white">
                    {editingId ? 'Edit Task' : 'Create Task'}
                  </h3>
                  <button 
                    onClick={() => setIsFormOpen(false)} 
                    aria-label="Close dialog"
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <form onSubmit={onSubmit} className="p-5 space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Title</label>
                    <input
                      type="text" name="title" value={formData.title} onChange={onChange}
                      required placeholder="e.g. Optimize Mongo Indexes"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Description</label>
                    <textarea
                      name="description" value={formData.description} onChange={onChange}
                      required rows="3" placeholder="Describe context or criteria..."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Priority</label>
                      <select
                        name="priority" value={formData.priority} onChange={onChange}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all text-sm"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Due Date</label>
                      <input
                        type="date" name="dueDate" value={formData.dueDate} onChange={onChange}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="submit" className="flex-1 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition-all">
                      {editingId ? 'Save Changes' : 'Create Task'}
                    </button>
                    <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition-all">
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Dashboard;
