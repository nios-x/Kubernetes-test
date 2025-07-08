# Base image
FROM node:24-alpine3.21
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --save-dev typescript 
RUN npm install
COPY index.ts ./
RUN npx tsc
CMD ["node", "index.js"]
