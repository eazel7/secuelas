FROM node:4

ADD . /src
WORKDIR /src

RUN npm install

EXPOSE 3000

CMD npm run cerovueltas-start
