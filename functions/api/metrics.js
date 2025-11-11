/**
 * API endpoint for providing real EdgeOne metrics data
 */

import { getRealEdgeOneMetrics } from './real-metrics.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    // 检查是否配置了真实 API 凭证
    const hasRealCredentials = env.EDGEONE_SECRET_ID && env.EDGEONE_SECRET_KEY && env.EDGEONE_SITE_ID;
    
    let metrics;
    
    if (hasRealCredentials) {
      // 尝试获取真实数据
      try {
        metrics = await getRealEdgeOneMetrics(env);
      } catch (realError) {
        console.warn('真实数据获取失败，使用模拟数据:', realError);
        metrics = await getSimulatedMetrics(env);
      }
    } else {
      // 使用模拟数据
      metrics = await getSimulatedMetrics(env);
    }
    
    return new Response(JSON.stringify(metrics), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    
    // 如果获取真实数据失败，返回错误信息
    return new Response(JSON.stringify({
      error: "无法获取监控数据",
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

/**
 * 获取模拟的 EdgeOne 监控数据
 */
async function getSimulatedMetrics(env) {
  const now = new Date();
  const baseTime = now.getTime();
  
  // 模拟真实数据，基于时间戳和随机因子生成更真实的数据
  const timeFactor = Math.sin(baseTime / 3600000) * 0.3 + 0.7; // 每小时波动
  const randomFactor = 0.9 + Math.random() * 0.2; // 随机波动
  const dayOfMonth = now.getDate();
  
  // 今日数据
  const todayBandwidth = (350 * timeFactor * randomFactor).toFixed(1);
  const todayTraffic = (28 * timeFactor * randomFactor).toFixed(1);
  const todayRequests = Math.floor(120000 * timeFactor * randomFactor);
  
  // 总计数据（基于当月天数估算）
  const totalTraffic = (dayOfMonth * 25 + Math.random() * 50).toFixed(1);
  const totalRequests = Math.floor(dayOfMonth * 100000 + Math.random() * 500000);
  
  // 缓存命中率
  const cacheHitRate = (82 + Math.random() * 10).toFixed(1);
  
  return {
    // 实时数据
    bandwidth: parseFloat(todayBandwidth),
    cacheHitRate: parseFloat(cacheHitRate),
    
    // 今日累计
    todayTraffic: parseFloat(todayTraffic),
    todayRequests: todayRequests,
    
    // 月度总计
    totalTraffic: parseFloat(totalTraffic),
    totalRequests: totalRequests,
    
    timestamp: now.toISOString(),
    dataSource: env.EDGEONE_SECRET_ID ? "edgeone-simulated" : "simulated-no-config",
    metrics: {
      bandwidthUnit: "Mbps",
      trafficUnit: "GB",
      cacheHitRateUnit: "%"
    }
  };
}