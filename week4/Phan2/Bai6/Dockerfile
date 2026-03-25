FROM node:18 AS build

WORKDIR /app
COPY package.json ./
COPY build.js ./
COPY src ./src

RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["npm", "start"]
