FROM node:18

WORKDIR /app

COPY .  .

RUN npm install --quiet --no-optional --no-fund --loglevel=error 