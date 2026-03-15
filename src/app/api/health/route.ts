import { NextResponse } from 'next/server';

let requestCount = 0;

setInterval(() => {
  console.log(`[Health API] Requests per minute: ${requestCount}`);
  requestCount = 0;
}, 60000); // every minute

export async function GET() {
  requestCount++;

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
    version: process.env.npm_package_version || '1.0.0',
    requestsPerMinute: requestCount,
  });
}