FROM node:18-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY prisma ./prisma
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run prisma:generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY start.sh ./start.sh
RUN chmod +x start.sh
EXPOSE 4000
CMD ["./start.sh"]
