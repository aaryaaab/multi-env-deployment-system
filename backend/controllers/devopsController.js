const promClient = require('prom-client');

// Keep track of CPU usage across request ticks
let lastCpuUsage = process.cpuUsage();
let lastCpuTime = process.hrtime();

// Helper to calculate Node CPU Consumption (%)
const getCpuUsagePercentage = () => {
  const hrTime = process.hrtime(lastCpuTime);
  const cpuUsage = process.cpuUsage(lastCpuUsage);
  
  // Update last values
  lastCpuUsage = process.cpuUsage();
  lastCpuTime = process.hrtime();
  
  // Convert duration to microseconds
  const elapsedMicros = hrTime[0] * 1000000 + hrTime[1] / 1000;
  
  if (elapsedMicros === 0) return 0;
  
  const totalCpuTime = cpuUsage.user + cpuUsage.system;
  const percentage = (totalCpuTime / elapsedMicros) * 100;
  
  return Math.min(100, Math.max(0, percentage));
};

// @desc    Get real-time backend telemetry metrics
// @route   GET /api/devops/metrics
// @access  Private
exports.getDevOpsMetrics = async (req, res, next) => {
  try {
    const counter = promClient.register.getSingleMetric('http_requests_total');
    let totalRequests = 0;
    const routeMetrics = {};
    
    if (counter) {
      const data = await counter.get();
      if (data && data.values) {
        for (const val of data.values) {
          totalRequests += val.value;
          const route = val.labels.route || '/';
          routeMetrics[route] = (routeMetrics[route] || 0) + val.value;
        }
      }
    }

    const cpuUsage = getCpuUsagePercentage();
    const memoryUsage = process.memoryUsage().rss / (1024 * 1024); // RSS in MB
    
    res.status(200).json({
      status: 'Operational',
      uptime: process.uptime(), // Uptime of Node process in seconds
      cpuUsage: parseFloat(cpuUsage.toFixed(2)),
      memoryUsage: parseFloat(memoryUsage.toFixed(2)),
      totalRequests,
      routeMetrics
    });
  } catch (error) {
    next(error);
  }
};
