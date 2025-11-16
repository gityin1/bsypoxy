/**
 * 修复版 EdgeOne Pages Functions - 添加基础测试
 */

import { initConstants } from '../lib/constants.js';
import { handleRequest } from '../lib/handlers.js';
import { validateEnvironment, createErrorResponse, logRequest, isValidPath } from '../lib/utils.js';

// 简化版本 - 先确保基础功能正常
let performanceMonitor, optimizationManager;

// 延迟加载监控模块，避免启动错误
async function loadMonitorModules() {
  try {
    performanceMonitor = (await import('../lib/performance-monitor.js')).default;
    optimizationManager = (await import('../lib/edgeone-optimization.js')).optimizationManager;
    console.log('✅ 监控模块加载成功');
    return true;
  } catch (error) {
    console.error('❌ 监控模块加载失败:', error);
    // 提供降级方案
    performanceMonitor = {
      getPerformanceReport: () => ({
        summary: { 
          uptime: "0m", 
          totalRequests: 0, 
          errorRate: "0%", 
          averageResponseTime: "0ms", 
          requestsPerMinute: "0" 
        },
        health: { 
          status: "unknown", 
          score: 0, 
          recommendations: ["监控系统初始化中"] 
        }
      }),
      getClientRegion: () => 'global',
      startRequest: () => `trace_${Date.now()}`,
      endRequest: () => null
    };
    optimizationManager = {
      checkAndOptimize: () => false
    };
    return false;
  }
}

// 缓存环境变量
let envCache = null;
let lastEnvCheck = 0;
const ENV_CACHE_TTL = 10800000;

function getCachedEnv(env) {
  const now = Date.now();
  if (!envCache || now - lastEnvCheck > ENV_CACHE_TTL) {
    initConstants(env);
    const missingVars = validateEnvironment(env);
    envCache = { 
      initialized: missingVars.length === 0,
      missingVars,
      timestamp: now
    };
    lastEnvCheck = now;
  }
  return envCache;
}

export async function onRequest(context) {
  const { request, env } = context;
  
  const url = new URL(request.url);
  const path = url.pathname;

  console.log(`📨 收到请求: ${request.method} ${path}`);

  // 🔧 基础测试端点 - 确保路由工作
  if (path === '/_/test') {
    return new Response(JSON.stringify({
      status: "success",
      message: "基础路由工作正常",
      timestamp: new Date().toISOString(),
      path: path,
      method: request.method
    }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  // 🔧 调试端点 - 详细的系统状态
  if (path === '/_/debug') {
    try {
      // 初始化环境
      const envStatus = getCachedEnv(env);
      
      // 加载监控模块
      const modulesLoaded = await loadMonitorModules();
      
      // 测试性能监控
      const monitorReport = performanceMonitor.getPerformanceReport();
      
      // 测试优化管理器
      const optimizerReport = optimizationManager ? optimizationManager.getOptimizationReport ? optimizationManager.getOptimizationReport() : { optimized: false } : { optimized: false };
      
      return new Response(JSON.stringify({
        status: "debug_success",
        environment: {
          initialized: envStatus.initialized,
          missingVars: envStatus.missingVars,
          hasAddress: !!env.ADDRESS && env.ADDRESS !== 'YOUR_ADDRESS',
          hasToken: !!env.TOKEN && env.TOKEN !== 'YOUR_TOKEN'
        },
        modules: {
          monitor: modulesLoaded,
          optimizer: !!optimizationManager
        },
        performance: monitorReport,
        optimization: optimizerReport,
        request: {
          method: request.method,
          url: request.url,
          headers: Object.fromEntries(request.headers)
        },
        timestamp: new Date().toISOString()
      }, null, 2), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        status: "debug_error",
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }, null, 2), {
        status: 500,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }

  // 🔧 健康检查端点
  if (path === '/_/health') {
    try {
      await loadMonitorModules();
      const report = performanceMonitor.getPerformanceReport();
      const healthStatus = report.health.status;
      const statusCode = healthStatus === 'poor' ? 503 : 200;
      
      return new Response(JSON.stringify({
        status: healthStatus,
        score: report.health.score,
        timestamp: new Date().toISOString(),
        recommendations: report.health.recommendations,
        simple: true
      }), {
        status: statusCode,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        status: "error",
        message: "健康检查失败: " + error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }

  // 🔧 性能监控端点
  if (path === '/_/metrics') {
    try {
      await loadMonitorModules();
      const report = performanceMonitor.getPerformanceReport();
      return new Response(JSON.stringify(report, null, 2), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: "监控数据获取失败",
        message: error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }

  // 初始化环境变量
  const envStatus = getCachedEnv(env);
  if (!envStatus.initialized) {
    return createErrorResponse(
      500, 
      `Missing required environment variables: ${envStatus.missingVars.join(', ')}`,
      request.headers.get("origin") ?? "*"
    );
  }

  // 延迟加载监控模块用于正常请求
  await loadMonitorModules();
  
  // 开始性能监控
  const region = performanceMonitor.getClientRegion(request);
  const traceId = performanceMonitor.startRequest(request, region);

  // 执行智能边缘优化检查
  try {
    optimizationManager.checkAndOptimize();
  } catch (error) {
    console.error('优化检查失败:', error);
  }

  try {
    // 根路径返回服务信息
    if (path === '/' || path === '') {
      const performanceReport = performanceMonitor.getPerformanceReport();
      const responseData = {
        service: "OpenList Proxy",
        status: "running",
        timestamp: new Date().toISOString(),
        version: "2.0.1-fixed",
        endpoints: {
          test: "/_/test",
          debug: "/_/debug",
          metrics: "/_/metrics",
          health: "/_/health"
        }
      };

      performanceMonitor.endRequest(traceId, 200);
      
      return new Response(JSON.stringify(responseData), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 路径验证
    if (!isValidPath(path)) {
      performanceMonitor.endRequest(traceId, 400);
      return createErrorResponse(
        400,
        "Invalid path",
        request.headers.get("origin") ?? "*"
      );
    }

    // 处理实际请求
    const response = await handleRequest(request);
    
    // 记录请求完成
    performanceMonitor.endRequest(traceId, response.status);

    return response;
    
  } catch (error) {
    // 记录错误请求
    performanceMonitor.endRequest(traceId, 500);
    
    console.error('请求处理失败:', error);
    return createErrorResponse(
      500,
      "Internal server error",
      request.headers.get("origin") ?? "*"
    );
  }
}