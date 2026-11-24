FROM node:24-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# NEXT_PUBLIC_ variables are baked into the build: declare each one you use, e.g.
# ARG NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM node:24-alpine
WORKDIR /app
# HOSTNAME=:: makes the standalone server listen on every interface, IPv6 and IPv4.
# Next.js reads HOSTNAME, not HOST. PORT is the port the HTTP endpoint points at.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=:: \
    PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
# The pre-deploy migration script runs outside the server bundle, so it needs its own copy of postgres.
COPY --from=build /app/node_modules/postgres ./node_modules/postgres
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/scripts ./scripts
USER node
EXPOSE 3000
CMD ["node", "server.js"]
