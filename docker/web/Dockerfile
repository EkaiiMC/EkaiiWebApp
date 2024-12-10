# Adapted from https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# Install dependencies only when needed
FROM node:lts-slim AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:lts-slim AS builder
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate                   # <---important to support Prisma query engine in Alpine Linux in final image
RUN npm run build

# Production image, copy all the files and run next
FROM node:lts-slim AS prod
WORKDIR /app
RUN apt-get update && apt-get install -y openssl
RUN yarn add global prisma
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /app/logs && chown -R nextjs:nodejs /app/logs
# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.mjs ./
COPY --chown=nextjs:nodejs --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs prisma ./prisma/
COPY --chown=nextjs:nodejs docker-bootstrap-app.sh ./
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["sh","./docker-bootstrap-app.sh"]