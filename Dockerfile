# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app

# install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# copy source and build
COPY . .
RUN npm run build

# Stage 2: serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# optional: expose port
EXPOSE 8080

CMD ["nginx", "-g", "daemon on;"]
