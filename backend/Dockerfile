# 1. Use Node 20 LTS (Alpine) for better stability/compatibility
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Cache dependencies: Copy only package files first
COPY package*.json ./

# 4. Clean install (Reproducible build from lockfile)
RUN npm ci

# 5. Fix permissions for safety
RUN chown -R node:node /app

# 5. Copy source code -- chown to ensure user has access
COPY --chown=node:node . .

# 6. Switch to non-root user for security
USER node

# 6. Expose port
EXPOSE 3000

# 7. Default command (Good practice to default to start, override in compose for dev)
CMD ["npm", "start"]