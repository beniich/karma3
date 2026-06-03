# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci --legacy-peer-deps

# Copy codebase
COPY . .

# Build the project (frontend + server + worker compilation)
RUN npm run build

# --- Stage 2: Runner ---
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production --legacy-peer-deps

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose server port
EXPOSE 3000

# Start server by default
CMD ["node", "dist/server.cjs"]
