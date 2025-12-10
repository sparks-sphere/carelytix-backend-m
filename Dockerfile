# Base image
FROM node:20-alpine AS base
# Enable corepack to use pnpm without installing it manually every time
RUN corepack enable 
WORKDIR /app

# --- DEPS STAGE ---
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
# Copy prisma schema so we can generate the client
COPY prisma ./prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# [FIX 1] Generate Prisma Client specifically for Linux Alpine
# If you skip this, your app will crash because it can't find the database query engine
RUN npx prisma generate

# --- BUILDER STAGE ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# --- RUNNER (PROD) STAGE ---
FROM base AS prod
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy node_modules (now includes the generated prisma client from deps)
COPY --from=deps /app/node_modules ./node_modules

# Copy built code
COPY --from=builder /app/dist ./dist
COPY package.json ./
COPY prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/src/index.js"]
