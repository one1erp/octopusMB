# syntax=docker/dockerfile:1

FROM node:16.13.0

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production
COPY . .
CMD [ "node", "index.js" ]