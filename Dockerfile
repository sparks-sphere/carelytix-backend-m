
# Base image
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
RUN npm install -g pnpm

# Copy files needed for install
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install ALL deps (dev + prod)
RUN pnpm install --frozen-lockfile

# Build stage
FROM deps AS builder
COPY . .
RUN pnpm build

# Production stage
FROM base AS prod
RUN npm install -g pnpm

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy prisma schema (prisma migrate needs it)
COPY prisma ./prisma

# Copy built code
COPY --from=builder /app/dist ./dist
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/src/index.js"]
