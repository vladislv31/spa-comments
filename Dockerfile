FROM node:18

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/uploads

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]
