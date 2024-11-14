FROM node:lts-slim

# Install git
RUN apt-get -y update && apt-get install -y --no-install-recommends git \
    && corepack enable pnpm && corepack prepare pnpm@latest --activate \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV APP_HOME=/app
ENV PORT=4321
WORKDIR $APP_HOME
EXPOSE $PORT

ENV NODE_ENV=development

COPY . .