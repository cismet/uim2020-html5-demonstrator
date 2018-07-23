# builder container
#   - builds the frontend app (Vue, React, Webpack, ...)
# Use an official node image
FROM node:6-alpine AS builder
# Reads args and use them to configure the build, setting
# them as env vars
ARG CLIENT_VERSION=1.0
ENV CLIENT_VERSION=$CLIENT_VERSION

WORKDIR /app

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh curl && \
    rm -rf /var/cache/apk/*

RUN npm install -g bower

RUN curl -SL --output "uim2020-html5-demonstrator-$CLIENT_VERSION.tar.gz" "https://github.com/cismet/uim2020-html5-demonstrator/archive/v$CLIENT_VERSION.tar.gz" \
    && tar -xvzf "uim2020-html5-demonstrator-$CLIENT_VERSION.tar.gz" \
    && cd "uim2020-html5-demonstrator-$CLIENT_VERSION" \
    && npm install \
    && bower --allow-root install

# ---
# runner container
#  - nginx, to serve static built Vue app
# Use an official nginx image

FROM nginx:stable-alpine
ARG CLIENT_VERSION=1.0
ENV CLIENT_VERSION=$CLIENT_VERSION
# COPY dist from builder container to nginx html dir
COPY --from=builder /app/uim2020-html5-demonstrator-$CLIENT_VERSION/app/ /usr/share/nginx/html
#COPY config/nginx.default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# No need for CMD. It'll fallback to nginx image's one, which