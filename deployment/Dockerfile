FROM node:22-alpine 

RUN mkdir /app
RUN mkdir /app/logs

COPY . /app

WORKDIR /app

RUN npm i

EXPOSE 3000

ENTRYPOINT [ "node", "src/main.js" ]