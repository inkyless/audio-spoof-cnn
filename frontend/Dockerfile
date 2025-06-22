# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies and build the app
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
COPY frontend/.env.production .env.production

RUN npm run build

FROM node:20-alpine

# Install a simple static file server
RUN npm install -g serve

WORKDIR /app


# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Serve the static files
CMD ["serve", "-s", "dist", "-l", "3000"]