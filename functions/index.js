/**
 * EdgeOne Pages Functions handler for root path
 * This handles requests to the root "/" path
 */


/**
 * Handle GET requests to root path
 * @param {object} context - EdgeOne Pages context
 * @returns {Promise<Response>} HTML response with service info
 */
export async function onRequestGet(context) {
  const { request } = context;
  
  // Return the main HTML page
  const html = `











<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>小苏搬运工代理下载服务</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 16px;
            color: #1f2937;
        }
        
        .header p {
            font-size: 1.1rem;
            color: #6b7280;
        }
        
        .card {
            background: #f8fafc;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            border-left: 6px solid #3b82f6;
        }
        
        .card h2 {
            color: #1f2937;
            margin-bottom: 20px;
            font-size: 1.4rem;
        }
        
        .status {
            text-align: center;
            padding: 25px;
            background: #ecfdf5;
            border-radius: 12px;
            margin-bottom: 30px;
            border-left: 6px solid #10b981;
        }
        
        .status h2 {
            color: #065f46;
            margin-bottom: 15px;
        }
        
        .status p {
            margin-bottom: 10px;
            color: #047857;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin: 30px 0;
        }
        
        .feature {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            border-top: 4px solid #3b82f6;
        }
        
        .feature.edgeone {
            border-top-color: #10b981;
        }
        
        .feature h3 {
            color: #1f2937;
            margin-bottom: 15px;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
        }
        
        .feature h3:before {
            margin-right: 10px;
            font-size: 1.5rem;
        }
        
        .feature ul {
            list-style-type: none;
        }
        
        .feature li {
            margin-bottom: 10px;
            padding-left: 25px;
            position: relative;
        }
        
        .feature li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
        }
        
        .code-block {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
            margin: 15px 0;
        }
        
        .endpoint {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid #2196f3;
        }
        
        .endpoint-method {
            display: inline-block;
            background: #2196f3;
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-right: 10px;
        }
        
        .nav-button {
            display: inline-block;
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-right: 15px;
            margin-bottom: 10px;
            transition: background 0.3s;
        }
        
        .nav-button:hover {
            background: #2563eb;
        }
        
        .nav-button.secondary {
            background: #6b7280;
        }
        
        .nav-button.secondary:hover {
            background: #4b5563;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
        }
        
        /* 流量监控特定样式 */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 25px 0;
        }
        
        .metric-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border-top: 4px solid #8b5cf6;
        }
        
        .metric-card.bandwidth {
            border-top-color: #06b6d4;
        }
        
        .metric-card.requests {
            border-top-color: #10b981;
        }
        
        .metric-card.cache {
            border-top-color: #f59e0b;
        }
        
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            color: #1f2937;
            margin: 10px 0;
        }
        
        .metric-label {
            color: #6b7280;
            font-size: 0.9rem;
        }
        
        .metric-trend {
            font-size: 0.8rem;
            margin-top: 5px;
        }
        
        .trend-up {
            color: #ef4444;
        }
        
        .trend-down {
            color: #10b981;
        }
        
        .chart-container {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin: 20px 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        
        .chart-placeholder {
            height: 200px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6b7280;
            font-style: italic;
        }
        
        .refresh-button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-top: 10px;
            transition: background 0.3s;
        }
        
        .refresh-button:hover {
            background: #2563eb;
        }
        
        .last-updated {
            text-align: right;
            color: #6b7280;
            font-size: 0.8rem;
            margin-top: 10px;
        }

        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
            
            .metrics-grid {
                grid-template-columns: 1fr;
            }
            
            .nav-button {
                display: block;
                width: 100%;
                margin-right: 0;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 小苏搬运工代理下载服务</h1>
            <p>不要死！不要死！不要死！</p>
        </div>
        
        <div class="status">
            <h2>服务状态</h2>
            <p>代理服务已成功部署</p>
            <p>时间: <span id="current-time">${new Date().toLocaleString('zh-CN')}</span></p>
        </div>
        
        <!-- 新增的流量监控部分 -->
        <div class="card">
            <h2>📊 EdgeOne 流量动态监控</h2>
            <p>实时监控服务流量、带宽使用情况和性能指标</p>
            
            <div class="metrics-grid">
                <div class="metric-card bandwidth">
                    <div class="metric-label">当前带宽</div>
                    <div class="metric-value" id="bandwidth-value">-- Mbps</div>
                    <div class="metric-trend trend-up" id="bandwidth-trend">↑ 较昨日 +12%</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-label">今日流量</div>
                    <div class="metric-value" id="traffic-value">-- GB</div>
                    <div class="metric-trend trend-up" id="traffic-trend">↑ 本月已用 45%</div>
                </div>
                
                <div class="metric-card requests">
                    <div class="metric-label">请求次数</div>
                    <div class="metric-value" id="requests-value">--</div>
                    <div class="metric-trend trend-down" id="requests-trend">↓ 错误率 0.2%</div>
                </div>
                
                <div class="metric-card cache">
                    <div class="metric-label">缓存命中率</div>
                    <div class="metric-value" id="cache-value">--%</div>
                    <div class="metric-trend trend-up" id="cache-trend">↑ 性能优秀</div>
                </div>
            </div>
            
            <div class="chart-container">
                <h3>带宽使用趋势 (最近24小时)</h3>
                <div class="chart-placeholder">
                    📈 带宽监控图表 - 需接入EdgeOne控制台API
                </div>
            </div>
            
            <div class="chart-container">
                <h3>流量消耗分析 (本月)</h3>
                <div class="chart-placeholder">
                    📊 流量分析图表 - 需接入EdgeOne控制台API
                </div>
            </div>
            
            <button class="refresh-button" onclick="refreshMetrics()">
                🔄 刷新数据
            </button>
            <div class="last-updated">
                最后更新: <span id="last-updated-time">--</span>
            </div>
        </div>
        
        <div class="features-grid">
            <div class="feature edgeone">
                <h3>🌍 独特优势</h3>
                <ul>
                    <li>全球 3200+ 边缘节点分布式部署</li>
                    <li>超低延迟访问体验</li>
                    <li>弹性扩容，自动负载均衡</li>
                    <li>Serverless 架构，免运维</li>
                </ul>
            </div>
            
            <div class="feature">
                <h3>🔒 安全特性</h3>
                <ul>
                    <li>HMAC-SHA256 签名验证</li>
                    <li>请求过期时间检查</li>
                    <li>CORS 跨域支持</li>
                    <li>路径安全验证</li>
                </ul>
            </div>
            
            <div class="feature">
                <h3>⚡ 性能优势</h3>
                <ul>
                    <li>全球 CDN 加速</li>
                    <li>边缘计算处理</li>
                    <li>智能缓存优化</li>
                    <li>自动 HTTPS 加密</li>
                </ul>
            </div>
            
            <div class="feature">
                <h3>⚠️ 功能特性</h3>
                <ul>
                    <li>自定义请求头支持</li>
                    <li>自动重定向处理</li>
                    <li>优化某逻辑性</li>
                    <li>编不动了</li>
                </ul>
            </div>
        </div>
        
        <div class="card">
            <h2>📖 API 使用说明</h2>
            
            <div class="endpoint">
                <span class="endpoint-method">GET</span>
                <code>/api/{文件路径}?sign={签名}</code>
                <div style="margin-top: 8px; color: #64748b;">
                    代理获取指定路径的文件（需要签名验证）
                </div>
            </div>
            
            <h3>签名格式</h3>
            <div class="code-block">
// 签名生成算法
签名 = HMAC-SHA256(文件路径:过期时间, TOKEN)
最终签名 = Base64URL(签名) + ":" + 过期时间

// 示例
文件路径: "/test/file.jpg"
过期时间: 1762805037
TOKEN: "your-secret-token"

生成签名: "abc123def456...:1762805037"
            </div>
            
            <h3>完整示例</h3>
            <div class="code-block">
// 请求示例
GET /api/images/photo.jpg?sign=abc123def456...:1762805037

// 成功响应
{
    "code": 200,
    "data": {
        "url": "https://actual-file-url.com/file.jpg",
        "header": {
            "Content-Type": ["image/jpeg"]
        }
    }
}

// 错误响应
{
    "code": 401,
    "message": "签名不匹配"
}
            </div>
        </div>
        
        <div class="card">
            <h2>🔧 环境配置</h2>
            <p>在控制台中设置以下环境变量：</p>
            <div class="code-block">
// 必需的环境变量
EO_BACKEND_ADDRESS = "https://bsy.yinbl.cn"
EO_API_TOKEN = "your-secret-token"

// 可选的环境变量
EO_DISABLE_SIGN = "false"  // 是否禁用签名验证
            </div>
        </div>
        
        <div class="footer">
            <p>Powered by <a href="https://bsy.yinbl.cn">小苏搬运工</a> 此站基于<a href="https://curl.qcloud.com/mq1BYMBC">腾讯云</a>提供服务</p>
        </div>
    </div>

    <script>
        // 更新时间
        function updateTime() {
            const timeElement = document.getElementById('current-time');
            if (timeElement) {
                timeElement.textContent = new Date().toLocaleString('zh-CN');
            }
        }
        
        // 初始更新时间
        updateTime();
        
        // 每分钟更新时间
        setInterval(updateTime, 60000);

        // 流量监控功能
        function generateMockMetrics() {
            // 模拟数据生成 - 实际使用时需要替换为真实的API调用
            return {
                bandwidth: (Math.random() * 500 + 50).toFixed(1),
                traffic: (Math.random() * 50 + 10).toFixed(1),
                requests: Math.floor(Math.random() * 100000 + 50000).toLocaleString(),
                cacheHitRate: (Math.random() * 20 + 80).toFixed(1)
            };
        }

        function updateMetricsDisplay() {
            const metrics = generateMockMetrics();
            
            // 更新指标显示
            document.getElementById('bandwidth-value').textContent = `${metrics.bandwidth} Mbps`;
            document.getElementById('traffic-value').textContent = `${metrics.traffic} GB`;
            document.getElementById('requests-value').textContent = metrics.requests;
            document.getElementById('cache-value').textContent = `${metrics.cacheHitRate}%`;
            
            // 更新最后刷新时间
            document.getElementById('last-updated-time').textContent = new Date().toLocaleString('zh-CN');
        }

        function refreshMetrics() {
            // 显示加载状态
            const button = document.querySelector('.refresh-button');
            const originalText = button.textContent;
            button.textContent = '🔄 更新中...';
            button.disabled = true;
            
            // 模拟API调用延迟
            setTimeout(() => {
                updateMetricsDisplay();
                button.textContent = originalText;
                button.disabled = false;
                
                // 显示更新成功提示
                showToast('数据更新成功！');
            }, 800);
        }

        function showToast(message) {
            // 创建toast元素
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(toast);
            
            // 3秒后自动移除
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }

        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // 页面加载时初始化指标显示
        document.addEventListener('DOMContentLoaded', function() {
            updateMetricsDisplay();
            
            // 每5分钟自动刷新一次数据
            setInterval(updateMetricsDisplay, 5 * 60 * 1000);
        });
    </script>
</body>
</html>






















`;

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

/**
 * Handle other HTTP methods for API responses
 * @param {object} context - EdgeOne Pages context
 * @returns {Promise<Response>} JSON response with service info
 */
export async function onRequest(context) {
  const { request } = context;
  
  // For non-GET requests, return JSON
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({
      service: "OpenList Proxy",
      status: "running",
      platform: "EdgeOne Pages",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
      api_endpoint: "/api/download/{file-path}?sign={signature}"
    }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  
  // For GET requests, call the HTML handler
  return onRequestGet(context);
}