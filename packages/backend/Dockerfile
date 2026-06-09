# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files and tsconfig for workspace setup
COPY package.json package-lock.json tsconfig.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy backend package.json
COPY packages/backend/package.json ./packages/backend/

# Install dependencies
RUN npm ci --workspace=@uit-volunteer-map/backend --workspace=@uit-volunteer-map/shared

# Build shared package first
WORKDIR /app/packages/shared
RUN npm run build

# Copy backend source and build
WORKDIR /app/packages/backend
COPY packages/backend ./
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy shared package.json
COPY packages/shared/package.json ./packages/shared/

# Copy backend package.json
COPY packages/backend/package.json ./packages/backend/

# Install production dependencies only
RUN npm ci --workspace=@uit-volunteer-map/backend --workspace=@uit-volunteer-map/shared --omit=dev

# Copy built shared files
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

# Copy built backend files
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

WORKDIR /app/packages/backend

# Create directory for SQLite database
RUN mkdir -p /app/data

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
CMD ["node", "dist/index.js"]
