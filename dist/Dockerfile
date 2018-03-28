FROM node:8-alpine

ADD ./ /root/ticketwatcher
WORKDIR /root/ticketwatcher
RUN npm install
ENTRYPOINT ["node", "bin/www"]