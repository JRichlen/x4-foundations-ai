FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm@8.15.0

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/mcp-server/package.json ./packages/mcp-server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/mcp-server ./packages/mcp-server
COPY tsconfig.base.json ./

# Build the application
WORKDIR /app/packages/mcp-server
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["pnpm", "run", "dev"]
