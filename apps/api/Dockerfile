FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --frozen-lockfile --filter @workora/api... --ignore-scripts

FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api ./apps/api
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm --filter @workora/api prisma:generate
RUN pnpm --filter @workora/api build

FROM node:22-alpine AS runner
WORKDIR /app/apps/api
ENV NODE_ENV=production
RUN corepack enable
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./package.json
COPY apps/api/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh
EXPOSE 4000
CMD ["./docker-entrypoint.sh"]
