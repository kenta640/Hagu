# Efficiency Report for Hagu

This document outlines several efficiency issues identified in the Hagu codebase, prioritized by severity and impact.

## 🔴 CRITICAL: PrismaClient Instantiation Anti-Pattern

**Location:** `src/app/api/auth/[...nextauth]/route.ts`

**Issue:**
The code creates a new `PrismaClient` instance directly in the NextAuth route handler:

```typescript
const prisma = new PrismaClient();
```

**Why This Is Critical:**
- **Database Connection Exhaustion**: In serverless environments (Vercel, AWS Lambda), each function invocation may import this module, creating a new PrismaClient instance and establishing new database connections
- **Connection Pool Saturation**: Prisma maintains a connection pool, and creating multiple instances can quickly saturate the database's connection limit
- **Memory Waste**: Each PrismaClient instance has overhead, wasting memory in development with hot reloading
- **Performance Degradation**: Constant connection creation/teardown adds latency to authentication requests

**Impact:**
- Can cause "too many connections" errors in production
- Slower authentication/authorization flows
- Potential service outages under load

**Recommendation:**
Implement the singleton pattern following Prisma's official Next.js guide. This ensures only one PrismaClient instance exists across the application, properly reusing database connections.

**Status:** ✅ Fixed in this PR

---

## 🟡 MEDIUM: Dockerfile Inefficiencies

**Location:** `Dockerfile`

**Issues Identified:**

### 1. No Multi-Stage Build
The current Dockerfile uses a single stage, including development dependencies in the final image.

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
```

**Impact:**
- Larger image size (includes devDependencies)
- Slower deployment times
- Increased security surface area

**Recommendation:**
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. Outdated Node.js Version
Using Node.js 18, which is in maintenance mode (as noted by the comment about vulnerabilities).

**Recommendation:**
- Upgrade to Node.js 20 LTS or 22 (current LTS)
- Regularly update to patch security vulnerabilities

### 3. Inefficient Layer Caching
Copying all files before running npm install defeats Docker's layer caching.

**Current (inefficient):**
```dockerfile
COPY . .
RUN npm install
```

**Better approach:**
```dockerfile
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
```

This way, npm install only re-runs when dependencies change, not on every code change.

---

## 🟢 LOW: Turbopack Experimental Flag in Production

**Location:** `package.json`

**Issue:**
The build script uses the `--turbopack` flag:

```json
"build": "next build --turbopack"
```

**Why This Matters:**
- Turbopack is marked as experimental and may have stability issues
- Production builds should use stable, battle-tested tooling
- The default Next.js webpack compiler is production-ready and optimized

**Impact:**
- Potential build failures in production
- Unpredictable behavior
- May not support all Next.js features

**Recommendation:**
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

Keep Turbopack for development (faster HMR), but use the stable webpack compiler for production builds.

---

## 🟢 LOW: Dead Code / Empty Files

**Locations:**
- `src/hooks/useFetchUsers.ts` - Empty file
- `src/types/users.ts` - Empty file  
- `src/components/button.tsx` - Only contains a comment

**Issue:**
These files serve no purpose and create confusion for developers navigating the codebase.

**Impact:**
- Code clutter
- Confusion about intent
- Potential import errors if someone tries to use them
- Slightly larger git history

**Recommendation:**
Remove these files or implement them if they're planned for future use. If they're placeholders, add TODO comments explaining their purpose.

---

## 🟢 LOW: Missing Next.js Configuration Optimizations

**Location:** `next.config.ts`

**Issue:**
The Next.js configuration is mostly empty, missing several performance optimizations:

```typescript
const nextConfig: NextConfig = {
  /* config options here */
};
```

**Recommendations:**

### 1. Enable React Strict Mode
```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
};
```
Benefits: Identifies potential problems, ensures components are resilient to future React features

### 2. Enable SWC Minification (if not already default)
```typescript
const nextConfig: NextConfig = {
  swcMinify: true,
};
```
Benefits: Faster builds, smaller bundle sizes

### 3. Configure Image Optimization
```typescript
const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'], // for Google OAuth profile images
    formats: ['image/avif', 'image/webp'],
  },
};
```
Benefits: Faster image loading, better user experience, reduced bandwidth

### 4. Enable Compression
```typescript
const nextConfig: NextConfig = {
  compress: true,
};
```
Benefits: Reduced payload sizes

### 5. Production Source Maps (optional, based on debugging needs)
```typescript
const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false, // Set to true if needed for production debugging
};
```
Benefits: Smaller production builds (if disabled), faster builds

---

## Summary

| Priority | Issue | Impact | Difficulty |
|----------|-------|--------|------------|
| 🔴 Critical | PrismaClient Singleton | High | Easy |
| 🟡 Medium | Dockerfile Optimization | Medium | Medium |
| 🟢 Low | Remove Turbopack from Production | Low | Easy |
| 🟢 Low | Remove Dead Code | Low | Easy |
| 🟢 Low | Next.js Config Optimizations | Low-Medium | Easy |

**Recommended Action Plan:**
1. ✅ Fix PrismaClient singleton (this PR)
2. Optimize Dockerfile for production deployments
3. Update Next.js configuration with recommended optimizations
4. Remove or implement placeholder files
5. Remove experimental Turbopack flag from production build

---

*Report generated as part of efficiency analysis for the Hagu project.*
*Issues identified: 5 distinct categories*
*Critical issues: 1*
*Medium issues: 1*
*Low priority issues: 3*
