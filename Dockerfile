
ARG NODE_VERSION=23.11.0
################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Install pnpm
RUN npm install -g pnpm drizzle-kit

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.pnpm-store to speed up subsequent builds.
# Leverage bind mounts to package.json and pnpm-lock.yaml to avoid having to copy them
# into this layer.
COPY package.json .
COPY pnpm-lock.yaml .
COPY drizzle.config.ts .
COPY drizzle drizzle
RUN pnpm install --frozen-lockfile

################################################################################
# Create a stage for building the application.
FROM deps as build

# Copy the rest of the source files into the image.
COPY . .
# Install pnpm

COPY  drizzle.config.ts .
COPY  drizzle drizzle
RUN npm install -g pnpm drizzle-kit @libsql/client
# Ensure local.db is writable

# Run the build script.
RUN pnpm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final



RUN npm install -g pnpm drizzle-kit

# Use production node environment by default.
ENV NODE_ENV production

ENV AUTH_TRUST_HOST true
# Run the application as a non-root user.

USER node

# Install pnpm
# Copy package.json so that package manager commands can be used.
COPY package.json .
COPY drizzle.config.ts .
COPY drizzle drizzle




# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/server ./server
# Set node env to production mode.
ENV NODE_ENV=production
ENV DOCKER=true
# Expose the port that the application listens on.
EXPOSE  8080


# Run the application.
CMD ["sh", "-c", "pnpm serve --port 8080"]
