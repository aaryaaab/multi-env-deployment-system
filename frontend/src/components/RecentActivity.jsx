import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, CircleDashed, PlayCircle } from 'lucide-react';

export const RecentActivity = ({ tasks }) => {
  // Sort tasks by latest update or creation (assuming _id implies some recency, or we mock it)
  // Since we don't have createdAt, we'll just show the latest 5 tasks
  const recentTasks = [...tasks].reverse().slice(0, 5);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'In Progress': return <PlayCircle size={16} className="text-amber-500" />;
      default: return <CircleDashed size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
      <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200">Recent Activity</h3>
      
      {recentTasks.length > 0 ? (
        <div className="space-y-4">
          {recentTasks.map((task, i) => (
            <div key={task._id} className="relative pl-6 pb-4 border-l-2 border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
              <div className="absolute -left-[9px] top-0 bg-white dark:bg-slate-900 rounded-full">
                {getStatusIcon(task.status)}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {task.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Marked as <span className="font-semibold">{task.status || 'Todo'}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No recent activity.</p>
      )}
    </div>
  );
};
