FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update -y && apt-get install -y openssl
COPY . /app
WORKDIR /app
RUN chmod +x /app/init.sh
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run generate
RUN pnpm run build
EXPOSE 3000
ENTRYPOINT [ "/app/init.sh" ]
CMD [ "pnpm", "run", "start" ]