FROM node:12

WORKDIR /common
COPY ./common .

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY ./client/package*.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g
COPY ./client .

RUN mkdir -p ./src/common
RUN cp -r /common/* ./src/common

EXPOSE 3000

ENV CHOKIDAR_USEPOLLING true

# CMD ["npm", "start"]
CMD [ "npm", "start" ]