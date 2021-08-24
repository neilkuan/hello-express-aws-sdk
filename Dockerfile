FROM node:14 as builder
WORKDIR /usr/src/app
COPY package.json .
RUN npm install && npm i typescript @types/node -g
COPY . .
RUN npm run build && npm uninstall typescript -g


FROM node:14-alpine AS server
WORKDIR /app
COPY package* ./
RUN npm install
COPY --from=builder /usr/src/app/build ./build
EXPOSE 1337
RUN chown -R node /app
USER node
CMD ["node", "/app/build/server.js"]