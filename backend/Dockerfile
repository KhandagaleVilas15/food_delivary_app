FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=base /usr/src/app ./

ENV NODE_ENV=production

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]
