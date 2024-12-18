FROM node:22

WORKDIR /usr/app

COPY package*.json ./

# Install production dependencies.
RUN npm ci

# Copy local code to the container image.
COPY . .

RUN npm run build

ENV NODE_ENV=production

# Run the web service on container startup.
CMD [ "node", "build/index.js" ]