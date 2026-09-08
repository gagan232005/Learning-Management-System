FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN npm run build