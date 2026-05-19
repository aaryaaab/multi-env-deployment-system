import React, { useState, useEffect } from 'react';
import { Activity, Server, Cpu, Database } from 'lucide-react';
import CountUp from 'react-countup';

export const DevOpsMetrics = () => {
  const [cpuUsage, setCpuUsage] = useState(12);
  const [memUsage, setMemUsage] = useState(45);
  const [reqPerSec, setReqPerSec] = useState(320);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(5, Math.min(95, prev + (Math.random() * 10 - 5))));
      setMemUsage(prev => Math.max(20, Math.min(80, prev + (Math.random() * 4 - 2))));
      setReqPerSec(prev => Math.max(100, Math.min(1000, prev + (Math.random() * 50 - 25))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="glass p-4 rounded-xl flex items-center gap-4 transition-all hover:-translate-y-1">
        <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-lg">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">API Health</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">Operational</p>
        </div>
      </div>
      
      <div className="glass p-4 rounded-xl flex items-center gap-4 transition-all hover:-translate-y-1">
        <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg">
          <Server size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Uptime</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            <CountUp end={99.99} decimals={2} suffix="%" duration={2} />
          </p>
        </div>
      </div>

      <div className="glass p-4 rounded-xl flex items-center gap-4 transition-all hover:-translate-y-1">
        <div className="p-3 bg-purple-500/20 text-purple-500 rounded-lg">
          <Cpu size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">CPU Load</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {cpuUsage.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="glass p-4 rounded-xl flex items-center gap-4 transition-all hover:-translate-y-1">
        <div className="p-3 bg-amber-500/20 text-amber-500 rounded-lg">
          <Database size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Requests/sec</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {Math.round(reqPerSec)}
          </p>
        </div>
      </div>
    </div>
  );
};
