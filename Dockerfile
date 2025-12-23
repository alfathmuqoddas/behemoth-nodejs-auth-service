FROM node:24-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production


FROM node:24-slim AS builder
WORKDIR /app

COPY . .
RUN npm install && npm run build


FROM gcr.io/distroless/nodejs24-debian12 AS runner

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

USER nonroot

EXPOSE 3000

CMD ["dist/server.js"]