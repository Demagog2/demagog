#syntax=docker/dockerfile:1.2
FROM node:12.18.0-alpine

MAINTAINER bohac.v@gmail.com

WORKDIR /usr/local/app

ADD package.json .
ADD yarn.lock .

RUN yarn install

ADD webpack.config.js .
ADD tsconfig.json .

COPY app app

EXPOSE 8080
CMD yarn run webpack-dev-server --config webpack.config.js --host 0.0.0.0 --hot=only
