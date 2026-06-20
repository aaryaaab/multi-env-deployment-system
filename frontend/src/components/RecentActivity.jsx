import React from 'react';
import { CheckCircle2, CircleDot, PlayCircle, Star } from 'lucide-react';

export const RecentActivity = ({ tasks = [] }) => {
  // latest 5 tasks
  const recentTasks = [...tasks].reverse().slice(0, 5);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle2 size={13} className="text-emerald-500" />;
      case 'In Progress': return <PlayCircle size={13} className="text-amber-500" />;
      default: return <CircleDot size={13} className="text-slate-550" />;
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl shadow-sm h-full flex flex-col">
      <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-4 border-b border-slate-850 pb-3">Recent Activity</h3>
      
      {recentTasks.length > 0 ? (
        <div className="space-y-4 flex-1">
          {recentTasks.map((task) => (
            <div key={task._id} className="relative pl-6 pb-4 border-l border-slate-850 last:border-0 last:pb-0">
              <div className="absolute -left-[7px] top-0.5 bg-slate-950 rounded-full p-0.5">
                {getStatusIcon(task.status)}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-200 leading-tight">
                  {task.title}
                </p>
                <p className="text-[10px] text-slate-400">
                  Status: <span className="font-semibold text-slate-300">{task.status || 'Todo'}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <div className="w-8 h-8 rounded-lg bg-slate-850 text-slate-500 flex items-center justify-center mb-2">
            <Star size={14} />
          </div>
          <p className="text-xs font-semibold text-slate-350">You're all caught up!</p>
          <p className="text-[10px] text-slate-500 mt-1 max-w-[160px]">Create a task to see live database events.</p>
        </div>
      )}
    </div>
  );
};
