/**
 * API endpoint for providing real EdgeOne metrics data
 */

export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    // 获取真实监控数据
    const realMetrics = await getRealEdgeOneMetrics(env);
    
    return new Response(JSON.stringify(realMetrics), {
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
      message: error.message
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
 * 获取真实的 EdgeOne 监控数据
 * 这里需要替换为实际的 EdgeOne API 调用
 */
async function getRealEdgeOneMetrics(env) {
  // 模拟从 EdgeOne API 获取真实数据
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
    dataSource: "edgeone-simulated", // 标记为模拟数据，实际使用时改为 "edgeone-real"
    metrics: {
      bandwidthUnit: "Mbps",
      trafficUnit: "GB",
      cacheHitRateUnit: "%"
    }
  };
}

/**
 * 实际的 EdgeOne API 调用函数（需要配置）
 */
async function fetchRealEdgeOneMetrics(apiKey, siteId) {
  // 实际实现示例：
  /*
  const response = await fetch(`https://api.edgeone.ai/v1/sites/${siteId}/metrics`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`EdgeOne API error: ${response.status}`);
  }
  
  const data = await response.json();
  return processEdgeOneMetrics(data);
  */
  
  // 暂时返回模拟数据
  return getRealEdgeOneMetrics();
}

/**
 * 处理 EdgeOne API 返回的原始数据
 */
function processEdgeOneMetrics(rawData) {
  // 根据 EdgeOne API 返回的数据结构进行处理
  // 这里需要根据实际的 API 响应格式来解析
  
  return {
    bandwidth: rawData.bandwidth || 0,
    todayTraffic: rawData.todayTraffic || 0,
    todayRequests: rawData.todayRequests || 0,
    totalTraffic: rawData.totalTraffic || 0,
    totalRequests: rawData.totalRequests || 0,
    cacheHitRate: rawData.cacheHitRate || 0,
    timestamp: new Date().toISOString(),
    dataSource: "edgeone-real",
    metrics: {
      bandwidthUnit: "Mbps",
      trafficUnit: "GB",
      cacheHitRateUnit: "%"
    }
  };
}