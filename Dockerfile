FROM dockerfile/nodejs
MAINTAINER Tim Akinbo <takinbo@gmail.com>

ADD index.js /app/
ADD package.json /app/
WORKDIR /app/
RUN npm install

CMD npm start
