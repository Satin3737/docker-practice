# syntax=docker/dockerfile:1

# --- base: minimal image with node and corepack, used for all other stages ---
FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

# --- deps: installs dependencies, cached unless package.json or lockfile changes ---
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# --- dev: runs tsx watch against source bind-mounted from the host ---
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "pnpm db:generate && pnpm db:migrate-deploy && pnpm dev"]

# --- build: compiles to dist ---
FROM deps AS build
COPY . .
# prisma generate only needs a syntactically valid URL, not a live connection
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN pnpm exec prisma generate
RUN pnpm build

# --- prod-deps: node_modules from deps, stripped of devDependencies ---
FROM deps AS prod-deps
RUN pnpm prune --prod

# --- prod: minimal runtime image ---
FROM base AS prod
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/database/prisma ./src/database/prisma
COPY --from=build /app/src/common ./src/common
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY ecosystem.config.cjs ./
EXPOSE 3000
CMD ["sh", "-c", "pnpm db:migrate-deploy && pnpm prod"]
