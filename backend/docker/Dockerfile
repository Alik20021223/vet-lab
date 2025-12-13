FROM node:20-alpine

# Install build dependencies for native modules (bcrypt, sharp, etc.)
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    python3 \
    make \
    g++ \
    glib-dev \
    vips \
    vips-dev \
    && ln -sf python3 /usr/bin/python

# Install node-gyp globally for building native modules
RUN npm install -g node-gyp

WORKDIR /app

# Prisma will use the correct binary based on binaryTargets in schema.prisma

# Copy package files
COPY package*.json ./

# Install dependencies without running install scripts
RUN npm install --ignore-scripts

# Rebuild native modules (bcrypt, sharp)
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=0
RUN npm rebuild bcrypt sharp

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY src ./src

# Copy scripts
COPY scripts ./scripts

# Note: Run migrations manually after container starts:
# docker-compose exec app npx prisma migrate deploy

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]

