FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install


COPY src ./src
COPY prisma ./prisma

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
