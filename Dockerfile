FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
ARG VITE_AI_GATEWAY_API_KEY
ARG VITE_COMPOSIO_API_KEY
ARG VITE_USER_ID
ENV VITE_AI_GATEWAY_API_KEY=$VITE_AI_GATEWAY_API_KEY
ENV VITE_COMPOSIO_API_KEY=$VITE_COMPOSIO_API_KEY
ENV VITE_USER_ID=$VITE_USER_ID
RUN npm run build

FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]