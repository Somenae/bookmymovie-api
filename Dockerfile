FROM node:20

RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

USER node

COPY --chown=node package*.json ./

RUN npm install

COPY ./src ./src
COPY tsconfig.json .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]