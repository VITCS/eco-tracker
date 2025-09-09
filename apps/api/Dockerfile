# API Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev || npm install --production
COPY tsconfig.json ./
COPY src ./src
RUN npm install -D typescript && npx tsc
EXPOSE 4000
CMD ["node", "dist/index.js"]

