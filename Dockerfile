# ============================================
# Stage 1 — Dependencies
# ============================================
FROM node:22-alpine AS deps
WORKDIR /app

# Install libc6-compat for Alpine + native modules
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci --maxsockets=5 || npm ci --maxsockets=3

# ============================================
# Stage 2 — Build
# ============================================
FROM node:22-alpine AS builder
WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client vào generated/prisma/ + tạo stub cho .prisma/client/default
RUN npx prisma generate && \
    mkdir -p node_modules/.prisma/client && \
    echo 'module.exports = {}' > node_modules/.prisma/client/default.js

# Build Next.js (standalone mode)
# DATABASE_URL dummy để Next.js collect page data không crash (runtime sẽ dùng env thật)
ENV DOCKER=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
RUN NODE_OPTIONS='--max-old-space-size=3072' npx next build --webpack

# ============================================
# Stage 3 — Production Runner
# ============================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema + migrations (for prisma migrate deploy)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/package.json ./package.json

# Copy full node_modules for prisma CLI, seed scripts (tsx, dotenv, pg, bcryptjs...)
# standalone output already has its own minimal node_modules merged
COPY --from=builder /app/node_modules ./node_modules

# Seed scripts reference features/ for data imports
COPY --from=builder /app/features ./features

# tsconfig.json needed for path alias resolution (@/lib/...) in seed scripts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# lib/ needed for seed data imports (id-types, seed-audit)
COPY --from=builder /app/lib ./lib

# Create uploads directory
RUN mkdir -p uploads && chown nextjs:nodejs uploads

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
