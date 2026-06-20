import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, Plus } from 'lucide-react';

export const AnalyticsDashboard = ({ tasks = [] }) => {
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'High').length, color: '#f43f5e' }, // rose-500
    { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length, color: '#f59e0b' }, // amber-500
    { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length, color: '#3b82f6' } // blue-500
  ].filter(d => d.value > 0);

  const statusData = [
    { name: 'Todo', count: tasks.filter(t => t.status === 'Todo' || t.status === 'To Do').length },
    { name: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Completed', count: tasks.filter(t => t.status === 'Completed').length }
  ];

  const hasTasks = tasks.length > 0;

  if (!hasTasks) {
    return (
      <div className="bg-slate-900/20 border border-slate-900 border-dashed rounded-2xl p-8 py-14 text-center flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-slate-850 text-slate-500 flex items-center justify-center mb-4">
          <BarChart3 size={20} />
        </div>
        <h3 className="text-sm font-bold text-white mb-2">No task data to analyze</h3>
        <p className="text-xs text-slate-450 max-w-sm leading-relaxed mb-1">
          You're all caught up! Create your first task to start tracking your priorities, workflow rates, and completion stats.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Priority Distribution Chart */}
      <div className="bg-slate-900/20 border border-slate-900 p-5 rounded-xl">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Task Priority Distribution</h4>
        <div className="h-64 flex items-center justify-center">
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-slate-500">No priority data allocated</p>
          )}
        </div>
      </div>

      {/* Status Distribution Chart */}
      <div className="bg-slate-900/20 border border-slate-900 p-5 rounded-xl">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Workflow Status Distribution</h4>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(71, 85, 105, 0.05)', radius: 4 }}
                contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={34} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
