FROM node:12

WORKDIR /common
COPY ./common .

WORKDIR /app
COPY ./server/package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY ./server .

RUN mkdir -p ./common
RUN cp -r /common/* ./common


EXPOSE 3001



CMD ["nodemon", "--legacy-watch", "index.js"]