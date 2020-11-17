FROM node:12.14-alpine3.10
# RUN npm install -g @nestjs/cli
WORKDIR /www
COPY yarn.lock package.json /www/
RUN yarn install
COPY ./ /www/
ENV TZ=Asia/Manila
CMD ["yarn", "start"]
