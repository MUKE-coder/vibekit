# VibeKit — Pre-Deploy Code Review Prompt

> **When to use:** Run this prompt in Claude Code as the FINAL task before deploying to production. It performs a senior-level audit covering performance, security, background tasks, and resource usage.

> **How to use:** Open Claude Code in your project root, paste the prompt below, and let it generate the review report. Address every Critical issue before deploying. Address High priority issues within the first week of launch.

---

## The Prompt — copy everything below

```
I need you to perform a comprehensive senior-level code review of my codebase.
Analyze the code thoroughly and identify issues in these critical areas.

## 1. HIGH CPU INTENSIVE TASKS & RESOURCE CONSUMPTION

Identify and flag:
- Synchronous blocking operations in request handlers
- Heavy computational tasks running in main threads
- Inefficient algorithms (O(n²) or worse when O(n log n) is possible)
- Expensive operations inside loops
- Recursive functions without memoization
- String concatenation in tight loops
- Large object serialization/deserialization in hot paths
- Regex operations that could cause catastrophic backtracking
- Missing pagination on large dataset operations
- Unoptimized image/file processing

### JS Bundle & Web Vitals (new):
- Eager imports of `@react-pdf/renderer`, `xlsx`, chart/editor/map libraries (should use `next/dynamic`)
- Missing `<Suspense>` boundaries around data-fetching sections (blocks page render)
- Missing `<ErrorBoundary>` wrappers on major page blocks (one crash kills the whole page)
- Images without `aspect-ratio` or explicit dimensions (causes CLS)
- CSS/JS animations on `top`/`left`/`width`/`height` instead of `transform`/`opacity` (causes layout thrashing)
- Missing `will-change: transform` on heavy animated elements (hero sections, viewport-filling animations)
- Large client component bundles that could be Server Components (check for unnecessary `"use client"`)
- CLS contributors: font swap without `size-adjust`, layout shifts from dynamic ads/content
- LCP contributors: hero image without `priority`, font without `preload: true`, client-side hero content

For each issue found:
- Show the problematic code (file path + line numbers)
- Explain the CPU impact
- Provide optimized alternative with code example
- Estimate performance improvement

## 2. PERFORMANCE BOTTLENECKS

### Database & Query Issues:
- N+1 query problems (missing eager loading, includes, or joins)
- SELECT * instead of specific columns
- Missing database indexes on frequently queried columns
- Queries inside loops
- Lack of query result caching (Redis `getCachedOrFetch` not used on hot API routes)
- Missing connection pooling
- Inefficient ORM usage
- Missing batch operations (bulk inserts/updates)
- Suboptimal transaction boundaries

### Redis Cache Audit:
- Hot API route GET handlers without `getCachedOrFetch()` wrapper
- POST/PATCH/DELETE handlers without `invalidateTag()` call
- Cache keys with no TTL or TTL too long (>5min for data, >1h for reference)
- Cache invalidation missing on related entities (e.g. updating invoice doesn't invalidate dashboard stats)
- Incorrect cache key patterns (missing user ID scope, leaking data across users)
- Over-cached data (sessions, raw file contents, real-time data)
- No cache warming strategy for critical dashboard queries
- Cache stampede risk on high-traffic endpoints (consider `Promise.all` deduplication)

### Logging & Monitoring:
- Excessive logging in production (debug/trace levels)
- Logging inside tight loops
- Synchronous logging blocking operations
- Large object logging without truncation
- Missing log levels configuration
- Unstructured logs that hinder parsing

### Memory Leaks & Inefficiencies:
- Global variables holding large datasets
- Event listeners not being cleaned up
- Circular references
- Large arrays/collections not being cleared
- Streams not being properly closed
- Cache without expiration/size limits

### Network & I/O:
- Missing connection timeouts
- No retry logic with exponential backoff
- Sequential API calls that could be parallel
- Missing response compression
- Unnecessary data transfer
- No request batching where applicable

For each bottleneck:
- Pinpoint exact location in code (file path + line numbers)
- Measure/estimate impact (latency, throughput, memory)
- Provide optimized solution with code
- Suggest monitoring/profiling approach

## 3. BACKGROUND TASKS, CRON JOBS & ASYNC OPERATIONS

Review and optimize:
- Job queues without proper error handling
- Missing job idempotency (jobs that can't safely retry)
- Lack of job timeouts
- No dead letter queues for failed jobs
- Cron jobs without distributed locking (race conditions in multi-instance deployments)
- Background tasks without progress tracking
- Missing graceful shutdown handling
- Inefficient batch processing (not chunking large datasets)
- Jobs running at inappropriate intervals
- Missing job monitoring and alerting
- Cron schedules that overlap or conflict
- Workers without concurrency limits
- Missing job prioritization

For each issue:
- Show problematic implementation
- Explain production risks
- Provide robust alternative
- Recommend job infrastructure (if applicable)

## 4. SECURITY VULNERABILITIES

### Input Validation & Injection:
- SQL injection vulnerabilities
- NoSQL injection possibilities
- Command injection risks
- XSS (Cross-Site Scripting) vulnerabilities
- Path traversal vulnerabilities
- Unvalidated redirects
- Missing input sanitization
- Insufficient data type validation

### Authentication & Authorization:
- Hardcoded credentials or API keys
- Weak password policies
- Missing rate limiting on auth endpoints
- Insecure session management
- Missing CSRF protection
- Inadequate authorization checks
- Privilege escalation possibilities
- Missing multi-factor authentication

### Data Protection:
- Sensitive data in logs
- Unencrypted sensitive data storage
- Insecure crypto usage (weak algorithms, hardcoded keys)
- Missing encryption in transit
- Exposed internal endpoints
- Verbose error messages exposing system info

### Dependencies & Configuration:
- Outdated dependencies with known CVEs
- Missing security headers
- Insecure CORS configuration
- Debug mode enabled in production
- Exposed environment variables
- Missing rate limiting
- Unprotected admin interfaces

### Other:
- Mass assignment vulnerabilities
- Insecure deserialization
- XML external entity (XXE) vulnerabilities
- Server-side request forgery (SSRF)
- Missing security updates

For each vulnerability:
- Classify severity (Critical, High, Medium, Low)
- Show vulnerable code (file path + line numbers)
- Explain exploitation scenario
- Provide secure implementation
- Reference OWASP guidelines if applicable

## OUTPUT FORMAT

Structure your review as:

1. **Executive Summary** — high-level findings count and severity
2. **Critical Issues** — must fix before production
   - Issue description
   - Code location
   - Risk/Impact
   - Fix with code example
3. **High Priority Issues** — significant impact (same format)
4. **Medium Priority Issues** — should address soon (same format)
5. **Recommendations** — best practices and optimizations
6. **Refactored Code Examples** — show before/after for major changes
7. **Performance Metrics** — expected improvements where measurable
8. **Security Checklist** — compliance items to verify

## CONTEXT

- Tech stack: Next.js 16, TypeScript, Prisma v7, Neon Postgres, Better Auth, React Query, Upstash Redis, Framer Motion, Tailwind v4, shadcn/ui
- Deployment: Vercel + Cloudflare DNS
- Read project-description.md for the app's specific scope, integrations, and expected load
- Read project-phases.md to understand what's been built

Be thorough, specific, and provide actionable fixes with file paths, line numbers, and full code examples.

After the review, write the findings to `pre-deploy-review-report.md` at the project root so I can address them iteratively.
```

---

## After the Review

1. Read `pre-deploy-review-report.md` carefully.
2. Address every **Critical** issue before deploying. No exceptions.
3. Address every **High Priority** issue within the first week of launch.
4. Schedule **Medium Priority** issues for the next iteration.
5. Re-run this prompt after each major feature addition or before each public release.

---

*Part of the VibeKit Framework — github.com/MUKE-coder/vibekit*
