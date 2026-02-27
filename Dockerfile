FROM node:18-alpine
WORKDIR /app

# install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# copy source and build
COPY . .
RUN npm run build

# install serve to run the static build
RUN npm install -g serve

# expose port
EXPOSE 5000

# serve the built app
CMD ["serve", "-s", "dist", "-l", "5000"]
