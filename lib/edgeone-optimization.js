/**
 * 优化管理器 - 使用简化版本
 */

import { optimizationManager } from './simple-optimizer.js';

// 直接导出简化版本
export { optimizationManager };
export const OPTIMIZATION_CONFIG = {
  CACHE_TTL: 10800000,
  PERFORMANCE_MONITORING: true,
  AUTO_OPTIMIZATION: true
};