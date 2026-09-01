# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Prevent react-scripts from treating warnings as fatal errors in CI
ENV CI=false
ENV DISABLE_ESLINT_PLUGIN=true

# Copy package files
COPY package*.json ./
RUN npm install --production=false --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install serve globally
RUN npm install -g serve

EXPOSE 3000

# Use serve to host the static files
CMD ["serve", "-s", "build", "-l", "3000", "--single"]