FROM node:20-bullseye AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN apt-get update && apt-get install -y libssl1.1 || apt-get install -y libssl-dev
RUN yarn install

COPY . .

RUN yarn prisma:generate
RUN yarn build

FROM node:20-bullseye AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN apt-get update && apt-get install -y libssl1.1 || apt-get install -y libssl-dev
RUN yarn install --production

COPY . .
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma

RUN yarn prisma:generate

CMD ["yarn", "start:prod"]
