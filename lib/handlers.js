/**
 * 优化版本请求处理器 - 提升下载性能和并发处理能力
 */

import { getConstants } from './constants.js';
import { verify } from './verify.js';

// 预定义头部列表（减少重复计算）
const STRIP_HEADERS = [
  "referer", "referrer", "origin", "host", "hosts",
  "x-forwarded-host", "x-forwarded-for", "x-forwarded-proto", 
  "x-forwarded-port", "x-real-ip", "forwarded", "via"
];

// 允许的响应头白名单
const ALLOWED_HEADERS = [
  "content-type", "content-disposition", "content-range",
  "accept-ranges", "etag", "last-modified", "cache-control",
  "expires", "content-encoding", "content-length"
];

/**
 * 优化的头部处理函数
 */
function optimizeHeaders(headers, toRemove) {
  const newHeaders = new Headers(headers);
  toRemove.forEach(header => newHeaders.delete(header));
  return newHeaders;
}

/**
 * 优化的下载处理器
 */
export async function handleDownload(request) {
  const { ADDRESS, TOKEN, PAGES_ADDRESS, DISABLE_SIGN } = getConstants();
  const origin = request.headers.get("origin") ?? "*";
  const url = new URL(request.url);
  const path = decodeURIComponent(url.pathname);

  if (!DISABLE_SIGN) {
    const sign = url.searchParams.get("sign") ?? "";
    const [verifyResult] = await Promise.all([
      verify(path, sign),
    ]);
    
    if (verifyResult !== "") {
      return new Response(
        JSON.stringify({
          code: 401,
          message: verifyResult,
          optimized: true
        }),
        {
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": origin,
            "X-Edge-Optimized": "true"
          },
        }
      );
    }
  }

  const optimizedHeaders = optimizeHeaders(request.headers, STRIP_HEADERS);
  
  const [backendResp] = await Promise.all([
    fetch(`${ADDRESS}/api/fs/link`, {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: TOKEN,
      },
      body: JSON.stringify({ path }),
    }),
  ]);
  
  const res = await backendResp.json();
  if (res.code !== 200) {
    return new Response(JSON.stringify({
      ...res,
      optimized: true
    }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": origin,
        "X-Edge-Optimized": "true"
      },
    });
  }

  const fileRequest = new Request(res.data.url, {
    method: "GET",
    headers: optimizedHeaders
  });
  
  if (res.data.header) {
    for (const [k, values] of Object.entries(res.data.header)) {
      for (const v of Array.isArray(values) ? values : [values]) {
        fileRequest.headers.set(k, v);
      }
    }
  }

  const fileResponse = await fetch(fileRequest);
  
  let finalResponse = fileResponse;
  if (finalResponse.status >= 300 && finalResponse.status < 400) {
    finalResponse = await handleRedirectChain(fileRequest, finalResponse, origin);
  }

  const responseHeaders = new Headers();
  const allowedSet = new Set(ALLOWED_HEADERS);
  
  for (const [k, v] of finalResponse.headers) {
    if (allowedSet.has(k.toLowerCase())) {
      responseHeaders.set(k, v);
    }
  }
  
  responseHeaders.set("Access-Control-Allow-Origin", origin);
  responseHeaders.set("Vary", "Origin");
  responseHeaders.set("X-Edge-Optimized", "true");
  responseHeaders.set("X-Edge-Performance", "boost");
  
  if (finalResponse.status === 200) {
    const contentType = finalResponse.headers.get("content-type") || "";
    if (contentType.startsWith("image/") || contentType.startsWith("video/") || contentType.startsWith("audio/")) {
      responseHeaders.set("Cache-Control", "public, max-age=3600");
    }
  }

  return new Response(finalResponse.body, {
    status: finalResponse.status,
    headers: responseHeaders,
  });
}

/**
 * 处理重定向链（优化版本）
 */
async function handleRedirectChain(originalRequest, response, origin) {
  let currentResponse = response;
  let redirectCount = 0;
  const maxRedirects = 5;
  
  while (currentResponse.status >= 300 && currentResponse.status < 400 && redirectCount < maxRedirects) {
    const location = currentResponse.headers.get("Location");
    if (!location) break;
    
    if (location.startsWith(`${getConstants().PAGES_ADDRESS}/`)) {
      const newRequest = new Request(location, {
        method: originalRequest.method,
        headers: optimizeHeaders(originalRequest.headers, STRIP_HEADERS)
      });
      return await handleDownload(newRequest);
    }
    
    const newRequest = new Request(location, {
      method: originalRequest.method,
      headers: optimizeHeaders(originalRequest.headers, STRIP_HEADERS)
    });
    
    currentResponse = await fetch(newRequest);
    redirectCount++;
  }
  
  return currentResponse;
}

/**
 * 优化的CORS预检处理器
 */
export function handleOptions(request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "X-Edge-Optimized": "true"
  };
  
  const headers = request.headers;
  if (headers.get("Origin") !== null && headers.get("Access-Control-Request-Method") !== null) {
    const respHeaders = {
      ...corsHeaders,
      "Access-Control-Allow-Headers": headers.get("Access-Control-Request-Headers") || "",
    };
    return new Response(null, { headers: respHeaders });
  }
  
  return new Response(null, {
    headers: {
      Allow: "GET, HEAD, OPTIONS",
      "X-Edge-Optimized": "true"
    },
  });
}

/**
 * 主请求处理器（优化版本）
 */
export async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }
  
  return await handleDownload(request);
}