FROM node:10-alpine

RUN mkdir /application
COPY . /application/
RUN rm -rf /application/node_modules
RUN npm install --no-dev

WORKDIR /application

CMD [ "npm", "start" ]