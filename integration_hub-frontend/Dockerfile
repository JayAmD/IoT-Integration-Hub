# Stage 1: Build the frontend application
FROM node:20-alpine AS build-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copy application files
COPY . .

# Set Vite API URL build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the production files
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:1.25-alpine
COPY --from=build-env /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
