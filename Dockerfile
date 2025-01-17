# Docker image of next
FROM node:16.18.0-alpine

RUN apk add --no-cache bash \
    tzdata 
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime 
RUN echo Asia/Shanghai > /etc/timezone 
RUN yarn config set registry https://registry.npmmirror.com

WORKDIR "/app"

COPY package*.json ./
COPY yarn.lock ./

RUN yarn
RUN yarn cache clean

COPY src ./src
COPY public ./public
COPY next.config.js ./
COPY next-env.d.ts ./
COPY tsconfig.json ./

RUN yarn build

ENV NEXT_PUBLIC_HOST_API http://192.168.3.6:3010

CMD ["yarn", "start"]
