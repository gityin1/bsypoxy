/**
 * 简化版性能监控 - 确保基础功能正常
 */

class SimplePerformanceMonitor {
  constructor() {
    console.log('🔄 初始化简化版性能监控');
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      totalResponseTime: 0
    };
    this.startedAt = Date.now();
    this.REQUEST_TRACES = new Map();
  }

  startRequest(request, region = 'global') {
    try {
      const traceId = `trace_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const startTime = Date.now();
      
      const trace = {
        id: traceId,
        method: request.method,
        path: new URL(request.url).pathname,
        region: region,
        startTime: startTime,
        startTimestamp: Date.now()
      };
      
      this.REQUEST_TRACES.set(traceId, trace);
      return traceId;
    } catch (error) {
      console.error('开始请求监控失败:', error);
      return `simple_${Date.now()}`;
    }
  }

  endRequest(traceId, status) {
    try {
      if (!traceId) return;
      
      const trace = this.REQUEST_TRACES.get(traceId);
      if (!trace) return;
      
      const endTime = Date.now();
      const duration = endTime - trace.startTime;
      
      // 更新基础指标
      this.metrics.requestCount++;
      this.metrics.totalResponseTime += duration;
      
      if (status >= 400) {
        this.metrics.errorCount++;
      }
      
      this.REQUEST_TRACES.delete(traceId);
    } catch (error) {
      console.error('结束请求监控失败:', error);
    }
  }

  getPerformanceReport() {
    try {
      const uptime = Date.now() - this.startedAt;
      const requestCount = this.metrics.requestCount;
      const errorCount = this.metrics.errorCount;
      const totalResponseTime = this.metrics.totalResponseTime;
      
      const avgResponseTime = requestCount > 0 ? totalResponseTime / requestCount : 0;
      const errorRate = requestCount > 0 ? (errorCount / requestCount) * 100 : 0;

      return {
        summary: {
          uptime: this.formatUptime(uptime),
          totalRequests: requestCount,
          errorRate: `${errorRate.toFixed(2)}%`,
          averageResponseTime: `${avgResponseTime.toFixed(2)}ms`,
          requestsPerMinute: this.calculateRPM(requestCount, uptime)
        },
        health: {
          status: this.getHealthStatus(errorRate, avgResponseTime),
          score: this.calculateHealthScore(errorRate, avgResponseTime),
          recommendations: this.getRecommendations(errorRate, avgResponseTime)
        },
        timestamp: new Date().toISOString(),
        version: 'simple-1.0'
      };
    } catch (error) {
      console.error('生成性能报告失败:', error);
      return this.getFallbackReport();
    }
  }

  formatUptime(ms) {
    try {
      const minutes = Math.floor(ms / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
      if (hours > 0) return `${hours}h ${minutes % 60}m`;
      return `${minutes}m`;
    } catch {
      return "0m";
    }
  }

  calculateRPM(requestCount, uptime) {
    try {
      const uptimeMinutes = uptime / 60000;
      return uptimeMinutes > 0 ? (requestCount / uptimeMinutes).toFixed(2) : "0";
    } catch {
      return "0";
    }
  }

  getHealthStatus(errorRate, avgResponseTime) {
    try {
      if (errorRate > 10 || avgResponseTime > 3000) return 'poor';
      if (errorRate > 5 || avgResponseTime > 1000) return 'degraded';
      if (errorRate > 1 || avgResponseTime > 500) return 'good';
      return 'excellent';
    } catch {
      return 'unknown';
    }
  }

  calculateHealthScore(errorRate, avgResponseTime) {
    try {
      let score = 100;
      if (errorRate > 0) score -= Math.min(errorRate * 2, 40);
      if (avgResponseTime > 100) score -= Math.min((avgResponseTime - 100) / 10, 30);
      return Math.max(0, Math.round(score));
    } catch {
      return 0;
    }
  }

  getRecommendations(errorRate, avgResponseTime) {
    try {
      const recommendations = [];
      if (errorRate > 5) recommendations.push('检查后端服务状态');
      if (avgResponseTime > 1000) recommendations.push('优化下载逻辑');
      if (recommendations.length === 0) recommendations.push('系统运行正常');
      return recommendations;
    } catch {
      return ['系统监控运行中'];
    }
  }

  getFallbackReport() {
    return {
      summary: {
        uptime: "0m",
        totalRequests: 0,
        errorRate: "0%",
        averageResponseTime: "0ms",
        requestsPerMinute: "0"
      },
      health: {
        status: "initializing",
        score: 100,
        recommendations: ["监控系统初始化完成"]
      },
      timestamp: new Date().toISOString(),
      version: 'simple-fallback'
    };
  }

  getClientRegion() {
    return 'global';
  }
}

// 导出实例
const simpleMonitor = new SimplePerformanceMonitor();
export default simpleMonitor;