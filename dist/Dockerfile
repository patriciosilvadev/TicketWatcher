FROM node:8-alpine

ADD ./ /root/ticketWatcher
WORKDIR /root/ticketWatcher
RUN npm install
ENTRYPOINT ["node", "bin/www"]
