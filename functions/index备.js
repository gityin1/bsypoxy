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