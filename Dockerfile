FROM node:18.9.0-alpine
RUN mkdir /app

COPY ./* /app/

WORKDIR /app

RUN npm install --include=dev

ENTRYPOINT [ "node" , "index.js" ]