# Execution Sandbox Dockerfile
# Secure environment for running CODE-FIRST scripts

FROM node:22-alpine

# Install dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    git \
    curl \
    && rm -rf /var/cache/apk/*

# Create sandbox user (non-root)
RUN addgroup -g 1001 sandbox && \
    adduser -D -u 1001 -G sandbox sandbox

# Set working directory
WORKDIR /workspace

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Set resource limits
ENV NODE_OPTIONS="--max-old-space-size=512"

# Switch to sandbox user
USER sandbox

# Default command
CMD ["node", "--version"]
