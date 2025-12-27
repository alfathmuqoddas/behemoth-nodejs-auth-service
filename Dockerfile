# --- DEPS STAGE ---
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# --- BUILDER STAGE ---
FROM node:24-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build
RUN mkdir -p /app/keys

# --- RUNNER STAGE ---
FROM gcr.io/distroless/nodejs24-debian12 AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nonroot:nonroot /app/keys /app/keys

USER nonroot
EXPOSE 3010

CMD ["dist/server.js"]