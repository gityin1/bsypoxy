/**
 * 真实 EdgeOne 监控数据 API
 */

// EdgeOne API 配置
const EDGEONE_API_ENDPOINT = 'https://edgeone.tencentcloudapi.com';
const EDGEONE_SERVICE = 'edgeone';
const EDGEONE_VERSION = '2021-03-23';

/**
 * 生成腾讯云 API 签名
 */
async function generateTCSignature(secretId, secretKey, payload, action) {
    const algorithm = 'TC3-HMAC-SHA256';
    const timestamp = Math.floor(Date.now() / 1000);
    const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
    
    // 1. 构造规范请求
    const hashedRequestPayload = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload));
    const hashedRequestPayloadHex = Array.from(new Uint8Array(hashedRequestPayload))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    
    const canonicalRequest = [
        'POST',
        '/',
        '',
        `content-type:application/json`,
        `host:${EDGEONE_SERVICE}.tencentcloudapi.com`,
        '',
        'content-type;host',
        hashedRequestPayloadHex
    ].join('\n');
    
    // 2. 构造待签字符串
    const credentialScope = `${date}/${EDGEONE_SERVICE}/tc3_request`;
    const hashedCanonicalRequest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonicalRequest));
    const hashedCanonicalRequestHex = Array.from(new Uint8Array(hashedCanonicalRequest))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    
    const stringToSign = [
        algorithm,
        timestamp,
        credentialScope,
        hashedCanonicalRequestHex
    ].join('\n');
    
    // 3. 计算签名
    const secretDate = await crypto.subtle.sign(
        'HMAC',
        await crypto.subtle.importKey('raw', new TextEncoder().encode(`TC3${secretKey}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
        new TextEncoder().encode(date)
    );
    
    const secretService = await crypto.subtle.sign(
        'HMAC',
        await crypto.subtle.importKey('raw', new Uint8Array(secretDate), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
        new TextEncoder().encode(EDGEONE_SERVICE)
    );
    
    const secretSigning = await crypto.subtle.sign(
        'HMAC',
        await crypto.subtle.importKey('raw', new Uint8Array(secretService), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
        new TextEncoder().encode('tc3_request')
    );
    
    const signature = await crypto.subtle.sign(
        'HMAC',
        await crypto.subtle.importKey('raw', new Uint8Array(secretSigning), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
        new TextEncoder().encode(stringToSign)
    );
    
    const signatureHex = Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    
    // 4. 构造 Authorization
    const authorization = [
        algorithm,
        `Credential=${secretId}/${credentialScope}`,
        `SignedHeaders=content-type;host`,
        `Signature=${signatureHex}`
    ].join(', ');
    
    return {
        authorization,
        timestamp,
        payload: hashedRequestPayloadHex
    };
}

/**
 * 调用 EdgeOne 监控 API
 */
async function callEdgeOneAPI(secretId, secretKey, action, params) {
    const payload = JSON.stringify(params);
    
    const signature = await generateTCSignature(secretId, secretKey, payload, action);
    
    const response = await fetch(`${EDGEONE_API_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Authorization': signature.authorization,
            'Content-Type': 'application/json',
            'Host': `${EDGEONE_SERVICE}.tencentcloudapi.com`,
            'X-TC-Action': action,
            'X-TC-Timestamp': signature.timestamp.toString(),
            'X-TC-Version': EDGEONE_VERSION
        },
        body: payload
    });
    
    if (!response.ok) {
        throw new Error(`EdgeOne API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
}

/**
 * 获取带宽数据
 */
async function getBandwidthData(secretId, secretKey, siteId) {
    const now = new Date();
    const endTime = now.toISOString();
    const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    
    try {
        const result = await callEdgeOneAPI(secretId, secretKey, 'DescribeEdgeOneBandwidthData', {
            ZoneId: siteId,
            StartTime: startTime,
            EndTime: endTime,
            Interval: '1h'
        });
        
        return result;
    } catch (error) {
        console.error('获取带宽数据失败:', error);
        throw error;
    }
}

/**
 * 获取流量数据
 */
async function getTrafficData(secretId, secretKey, siteId) {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    try {
        // 获取今日流量
        const todayResult = await callEdgeOneAPI(secretId, secretKey, 'DescribeEdgeOneTrafficData', {
            ZoneId: siteId,
            StartTime: startOfDay,
            EndTime: now.toISOString(),
            Interval: '1d'
        });
        
        // 获取本月流量
        const monthResult = await callEdgeOneAPI(secretId, secretKey, 'DescribeEdgeOneTrafficData', {
            ZoneId: siteId,
            StartTime: startOfMonth,
            EndTime: now.toISOString(),
            Interval: '1d'
        });
        
        return {
            today: todayResult,
            month: monthResult
        };
    } catch (error) {
        console.error('获取流量数据失败:', error);
        throw error;
    }
}

/**
 * 获取请求数据
 */
async function getRequestData(secretId, secretKey, siteId) {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    try {
        // 获取今日请求数
        const todayResult = await callEdgeOneAPI(secretId, secretKey, 'DescribeEdgeOneRequestData', {
            ZoneId: siteId,
            StartTime: startOfDay,
            EndTime: now.toISOString(),
            Interval: '1d'
        });
        
        // 获取本月请求数
        const monthResult = await callEdgeOneAPI(secretId, secretKey, 'DescribeEdgeOneRequestData', {
            ZoneId: siteId,
            StartTime: startOfMonth,
            EndTime: now.toISOString(),
            Interval: '1d'
        });
        
        return {
            today: todayResult,
            month: monthResult
        };
    } catch (error) {
        console.error('获取请求数据失败:', error);
        throw error;
    }
}

/**
 * 获取缓存命中率
 */
async function getCacheHitRate(secretId, secretKey, siteId) {
    const now = new Date();
    const startTime = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(); // 最近1小时
    
    try {
        const result = await callEdgeOneAPI(secretId, secretKey, 'DescribeEdgeOneCacheData', {
            ZoneId: siteId,
            StartTime: startTime,
            EndTime: now.toISOString(),
            Interval: '5m'
        });
        
        return result;
    } catch (error) {
        console.error('获取缓存数据失败:', error);
        throw error;
    }
}

/**
 * 处理真实数据的主函数
 */
export async function getRealEdgeOneMetrics(env) {
    const secretId = env.EDGEONE_SECRET_ID;
    const secretKey = env.EDGEONE_SECRET_KEY;
    const siteId = env.EDGEONE_SITE_ID;
    
    if (!secretId || !secretKey || !siteId) {
        throw new Error('EdgeOne API 凭证未配置完整');
    }
    
    try {
        // 并行获取所有监控数据
        const [bandwidthData, trafficData, requestData, cacheData] = await Promise.all([
            getBandwidthData(secretId, secretKey, siteId),
            getTrafficData(secretId, secretKey, siteId),
            getRequestData(secretId, secretKey, siteId),
            getCacheHitRate(secretId, secretKey, siteId)
        ]);
        
        // 处理返回的数据格式（根据实际 API 响应结构调整）
        const currentBandwidth = processBandwidthData(bandwidthData);
        const { todayTraffic, totalTraffic } = processTrafficData(trafficData);
        const { todayRequests, totalRequests } = processRequestData(requestData);
        const cacheHitRate = processCacheData(cacheData);
        
        return {
            bandwidth: currentBandwidth,
            todayTraffic: todayTraffic,
            todayRequests: todayRequests,
            totalTraffic: totalTraffic,
            totalRequests: totalRequests,
            cacheHitRate: cacheHitRate,
            timestamp: new Date().toISOString(),
            dataSource: "edgeone-real",
            metrics: {
                bandwidthUnit: "Mbps",
                trafficUnit: "GB",
                cacheHitRateUnit: "%"
            }
        };
    } catch (error) {
        console.error('获取真实监控数据失败:', error);
        throw error;
    }
}

// 数据处理函数（需要根据实际 API 响应结构调整）
function processBandwidthData(data) {
    // 这里根据实际 API 返回的数据结构处理
    // 示例：取最后一个时间点的带宽值
    if (data && data.Data && data.Data.length > 0) {
        return parseFloat(data.Data[data.Data.length - 1].Value || 0);
    }
    return 0;
}

function processTrafficData(data) {
    // 处理流量数据
    let todayTraffic = 0;
    let totalTraffic = 0;
    
    if (data.today && data.today.Data) {
        todayTraffic = data.today.Data.reduce((sum, item) => sum + parseFloat(item.Value || 0), 0) / 1024; // 转换为 GB
    }
    
    if (data.month && data.month.Data) {
        totalTraffic = data.month.Data.reduce((sum, item) => sum + parseFloat(item.Value || 0), 0) / 1024; // 转换为 GB
    }
    
    return {
        todayTraffic: parseFloat(todayTraffic.toFixed(1)),
        totalTraffic: parseFloat(totalTraffic.toFixed(1))
    };
}

function processRequestData(data) {
    // 处理请求数据
    let todayRequests = 0;
    let totalRequests = 0;
    
    if (data.today && data.today.Data) {
        todayRequests = data.today.Data.reduce((sum, item) => sum + parseInt(item.Value || 0), 0);
    }
    
    if (data.month && data.month.Data) {
        totalRequests = data.month.Data.reduce((sum, item) => sum + parseInt(item.Value || 0), 0);
    }
    
    return {
        todayRequests,
        totalRequests
    };
}

function processCacheData(data) {
    // 处理缓存命中率
    if (data && data.Data && data.Data.length > 0) {
        const lastDataPoint = data.Data[data.Data.length - 1];
        return parseFloat((lastDataPoint.HitRate || 0).toFixed(1));
    }
    return 0;
}

export async function onRequestGet(context) {
    const { request, env } = context;
    
    try {
        const realMetrics = await getRealEdgeOneMetrics(env);
        
        return new Response(JSON.stringify(realMetrics), {
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        console.error('Error fetching real metrics:', error);
        
        return new Response(JSON.stringify({
            error: "无法获取真实监控数据",
            message: error.message,
            timestamp: new Date().toISOString(),
            dataSource: "error"
        }), {
            status: 500,
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
}