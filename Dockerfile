FROM node:18.18.2-alpine as node 

COPY client /insta-client/

WORKDIR /insta-client

RUN npm install
CMD [ "npm","start" ]

