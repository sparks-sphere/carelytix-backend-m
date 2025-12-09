# Base image
FROM node:20-alpine AS base
WORKDIR /app
# Install pnpm & dependencies
FROM base AS deps
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
# Build stage (TypeScript + tsc-alias)
FROM deps AS builder
COPY . .
RUN pnpm build
# Production image
FROM base AS prod
RUN npm install -g pnpm

# Copy only necessary files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Important for Prisma
RUN pnpm prisma generate

CMD ["node", "dist/src/index.js"]
