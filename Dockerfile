FROM node:10-alpine
ARG BUILDMODE=''
RUN mkdir /application
COPY . /application/
RUN rm -rf /application/node_modules

WORKDIR /application
RUN npm install $BUILDMODE

CMD [ "npm", "start" ]