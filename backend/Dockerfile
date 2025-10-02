# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies (including dev for build)
RUN npm install

# Copy source code
COPY src/ ./src/

# Skip TypeScript build for now - start directly with JS runtime
# RUN npm run build

# Install ts-node for runtime TypeScript execution
RUN npm install -g ts-node

# Clean up node_modules and reinstall production only
RUN rm -rf node_modules && npm install --production

# Reinstall ts-node for production
RUN npm install -g ts-node

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Start command with ts-node (bypasses compilation step)
CMD ["npx", "ts-node", "--transpile-only", "src/index.ts"]
