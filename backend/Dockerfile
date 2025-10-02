# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /opt/render/project/src

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Clean up dev dependencies and keep only production
RUN npm prune --production

# Expose port
EXPOSE 4000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Command to run the application
CMD ["npm", "start"]
