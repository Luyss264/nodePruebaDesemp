FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY .env.example ./.env.example

RUN npm run build
RUN mkdir -p uploads

EXPOSE 3000

CMD ["npm", "start"]
