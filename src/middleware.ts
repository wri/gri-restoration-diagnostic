import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateSessionCookie } from '@/utils/session';

/**
 * Middleware for session validation on assessment routes
 * 
 * This middleware validates session cookies on protected assessment routes
 * but does NOT block requests. It allows all requests to continue, letting
 * the page components handle authentication prompts as needed.
 * 
 * Protected routes:
 * - /assessment/[id] (Overview page)
 * - /assessment/[id]/[theme] (Question pages)
 * 
 * Excluded routes (no validation):
 * - /assessment/setup (assessment creation)
 * - /assessment/[id]/created (success modal after creation)
 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  try {
    // Check if route is excluded from protection
    const excludedPatterns = [
      /^\/assessment\/setup/,
      /^\/assessment\/[^\/]+\/created$/,
    ];

    const isExcluded = excludedPatterns.some(pattern => pattern.test(path));
    if (isExcluded) {
      // Excluded routes - no validation needed
      return NextResponse.next();
    }

    // Check if route needs protection
    // Matches: /assessment/[id] or /assessment/[id]/[theme]
    const protectedRoutePattern = /^\/assessment\/([^\/]+)(?:\/([^\/]+))?$/;
    const match = path.match(protectedRoutePattern);

    if (!match) {
      // Not a protected route
      return NextResponse.next();
    }

    // Extract assessment ID from URL
    const assessmentId = match[1];

    // Get session cookie
    const sessionCookie = request.cookies.get('assessment_session');

    if (sessionCookie) {
      // Validate session
      const validationResult = validateSessionCookie(
        sessionCookie.value,
        assessmentId
      );

      if (validationResult.valid) {
        // Session is valid
        console.log(`[Middleware] Valid session for assessment: ${assessmentId}`);
      } else {
        // Session is invalid or expired
        console.log(`[Middleware] Invalid or expired session for assessment: ${assessmentId}`);
      }

      // Future enhancement: Session extension logic could go here
      // if (validationResult.valid) {
      //   const extendedCookie = extendSessionExpiry(sessionCookie.value);
      //   response.cookies.set('assessment_session', extendedCookie, { ... });
      // }
    } else {
      // No session cookie found
      console.log(`[Middleware] No session cookie found`);
    }

    // Always continue to the page - let the component handle auth UI
    return NextResponse.next();

  } catch (error) {
    // Log error but don't block the request
    console.error('[Middleware] Error during session validation:', error);
    return NextResponse.next();
  }
}

/**
 * Middleware configuration
 * 
 * Matcher patterns define which routes this middleware runs on.
 * Using a broad matcher for all /assessment routes, with exclusions
 * handled in the middleware logic for better control.
 */
export const config = {
  matcher: [
    '/assessment/:id*',
  ],
};
