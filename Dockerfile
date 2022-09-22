FROM node:18.9.0-alpine
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
RUN mkdir /app
WORKDIR /app

COPY . ./
RUN npm install --include=dev
RUN npm install --save-dev sequelize-cli
RUN ls
RUN NODE_ENV=${NODE_ENV} npx sequelize-cli db:migrate

ENTRYPOINT [ "node" , "index.js" ]