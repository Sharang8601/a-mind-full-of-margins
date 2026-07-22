# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies needed for typescript)
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Production environment
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Ensure the app runs on the correct port
ENV PORT=4000
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
