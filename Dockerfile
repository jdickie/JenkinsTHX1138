FROM node:10-alpine

RUN mkdir /application
COPY . /application/
RUN rm -rf /application/node_modules

WORKDIR /application

CMD [ "npm", "start" ]