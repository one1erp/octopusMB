# syntax=docker/dockerfile:1
FROM node:24.9.0-bookworm-slim

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci --omit=dev
COPY . .
CMD ["node", "index.js"]
