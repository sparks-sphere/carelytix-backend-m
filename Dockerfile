# Base image
FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm & dependencies
FROM base AS deps
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# Build stage (TypeScript + tsc-alias)
FROM deps AS builder
COPY . .
RUN pnpm build

# Production image
FROM base AS prod
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
# Copy Prisma schema
COPY prisma ./prisma
# Install ONLY production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built files
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/src/index.js"]
