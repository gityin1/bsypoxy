/**
 * 优化版本工具函数
 */

// 预编译正则表达式（提升路径验证性能）
const PATH_VALIDATION_REGEX = /(\.\.|\/\/)/;

/**
 * 创建优化的错误响应
 */
export function createErrorResponse(code, message, origin = "*") {
  const errorBody = JSON.stringify({
    code,
    message,
    timestamp: new Date().toISOString(),
    optimized: true
  });
  
  // 预定义响应头
  const headers = {
    "content-type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": origin,
    "X-Edge-Optimized": "true"
  };

  return new Response(errorBody, {
    status: code >= 200 && code < 300 ? 200 : code,
    headers,
  });
}

/**
 * 优化的请求日志记录
 */
export function logRequest(request, stage = "processing") {
  const url = new URL(request.url);
  console.log(`[${stage.toUpperCase()}|OPTIMIZED] ${request.method} ${url.pathname}${url.search}`);
}

/**
 * 环境变量验证（缓存友好）
 */
export function validateEnvironment(env) {
  const required = ['ADDRESS', 'TOKEN'];
  const missing = [];
  
  for (const key of required) {
    // 更严格的空值检查
    if (!env[key] || env[key].trim() === '' || env[key] === `YOUR_${key}`) {
      missing.push(key);
    }
  }
  
  return missing;
}

/**
 * 优化的路径验证
 */
export function isValidPath(path) {
  // 使用预编译正则提升性能
  if (PATH_VALIDATION_REGEX.test(path)) {
    return false;
  }
  
  // 必须以 / 开头
  if (!path.startsWith('/')) {
    return false;
  }
  
  return true;
}

/**
 * 性能监控工具
 */
export function startPerformanceMark(name) {
  if (typeof performance !== 'undefined') {
    performance.mark(`start-${name}`);
  }
}

export function endPerformanceMark(name) {
  if (typeof performance !== 'undefined') {
    performance.mark(`end-${name}`);
    performance.measure(name, `start-${name}`, `end-${name}`);
    const measure = performance.getEntriesByName(name)[0];
    console.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
  }
}