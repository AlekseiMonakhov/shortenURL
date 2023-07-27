FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --production=false

COPY . .

EXPOSE 3001

CMD [ "yarn", "nodemon", "index.js" ]
