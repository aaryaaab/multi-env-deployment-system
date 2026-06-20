import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Database, RefreshCw } from 'lucide-react';
import api from '../api';

export const DevOpsMetrics = () => {
  const [metrics, setMetrics] = useState({
    status: 'Loading...',
    cpuUsage: 0,
    memoryUsage: 0,
    totalRequests: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/devops/metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching DevOps metrics:', error);
        setMetrics(prev => ({
          ...prev,
          status: 'Offline'
        }));
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-850 pb-3">
        <h3 className="text-xs font-bold text-white tracking-wider uppercase">System Health</h3>
        <span className="flex h-2 w-2 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            metrics.status === 'Operational' ? 'bg-emerald-400' : 'bg-rose-400'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            metrics.status === 'Operational' ? 'bg-emerald-500' : 'bg-rose-500'
          }`}></span>
        </span>
      </div>

      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-slate-400">
              <Activity size={14} />
            </div>
            <span className="text-xs text-slate-400 font-medium">API Server</span>
          </div>
          <span className={`text-xs font-bold ${
            metrics.status === 'Operational' ? 'text-emerald-400' : 'text-rose-450'
          }`}>{metrics.status}</span>
        </div>

        {/* CPU */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-slate-400">
                <Cpu size={14} />
              </div>
              <span className="text-xs text-slate-400 font-medium">Node CPU Time</span>
            </div>
            <span className="text-xs font-bold text-white">{metrics.cpuUsage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, metrics.cpuUsage)}%` }}></div>
          </div>
        </div>

        {/* Memory */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-slate-400">
              <Database size={14} />
            </div>
            <span className="text-xs text-slate-400 font-medium">Memory Usage</span>
          </div>
          <span className="text-xs font-bold text-white">{metrics.memoryUsage.toFixed(1)} MB</span>
        </div>

        {/* Requests */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-slate-400">
              <RefreshCw size={14} />
            </div>
            <span className="text-xs text-slate-400 font-medium">Total Requests</span>
          </div>
          <span className="text-xs font-bold text-white">{metrics.totalRequests}</span>
        </div>
      </div>
    </div>
  );
};
