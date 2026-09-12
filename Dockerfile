# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Next.js"

# Next.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Build application. Both steps run here, at image-build time, instead of
# splitting "compile" now / "generate" later at every container boot (the
# original docker-entrypoint.js re-ran the "generate" step on every restart,
# which is real prerender work — that's what OOM'd the machine on its
# original 256MB, and even at 1GB it made every cold start slower and
# costlier than it needed to be). Doing the full build once here means the
# running machine only ever has to `next start` (serve), which needs far
# less memory and starts much faster when Fly wakes it from a stop.
RUN npx next build --experimental-build-mode compile
RUN npx next build --experimental-build-mode generate

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server directly — no docker-entrypoint.js needed now that the
# build is fully done above. (The file itself is left in the repo; it's
# just unused. Safe to delete if you want to tidy up.)
EXPOSE 3000
CMD [ "npm", "run", "start" ]
