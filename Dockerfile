FROM node:18 as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN node ace build --production \
    --ignore-ts-errors \
    && cd build \
    && yarn install --production --frozen-lockfile

FROM node:18-alpine
WORKDIR /app
RUN mkdir tmp
COPY --from=builder /app/build .
EXPOSE 3333
CMD ["node", "server.js"]
