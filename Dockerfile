# Stage 1: Build the React frontend
FROM node:16-slim as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Set up the backend and copy the frontend build
FROM node:16-slim
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Copy the frontend build from the previous stage
COPY --from=frontend-build /app/frontend/build ./public

# Create a directory for the data volume
RUN mkdir -p /app/data

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]