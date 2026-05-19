import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const AnalyticsDashboard = ({ tasks }) => {
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'High').length, color: '#f43f5e' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length, color: '#3b82f6' }
  ].filter(d => d.value > 0);

  const statusData = [
    { name: 'Todo', count: tasks.filter(t => t.status === 'Todo').length || tasks.filter(t => t.status === 'To Do').length },
    { name: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Completed', count: tasks.filter(t => t.status === 'Completed').length }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200">Task Priority Distribution</h3>
        <div className="h-64">
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">No data available</div>
          )}
        </div>
      </div>

      <div className="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200">Task Completion Status</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
