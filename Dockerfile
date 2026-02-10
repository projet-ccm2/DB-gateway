FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npm start"]
