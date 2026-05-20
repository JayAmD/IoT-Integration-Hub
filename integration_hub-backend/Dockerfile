# Stage 1: Install production dependencies
FROM node:20-alpine AS production-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: Create the final production image
FROM node:20-alpine
WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json ./

# Copy production node_modules from the first stage
COPY --from=production-dependencies-env /app/node_modules ./node_modules

# Copy the rest of the application files
COPY . .

# Expose the default backend port
EXPOSE 5500

# Start the application
CMD ["npm", "run", "start"]
