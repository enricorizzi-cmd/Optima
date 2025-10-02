# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --include=dev

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Install production dependencies only
RUN npm ci --omit=dev

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Start command
CMD ["node", "dist/index.js"]
