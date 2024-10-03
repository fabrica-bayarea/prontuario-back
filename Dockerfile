FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm update

RUN npm install --quiet --no-optional --no-fund --loglevel=error 

COPY .  .

RUN npx prisma generate