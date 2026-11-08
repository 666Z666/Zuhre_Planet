# 1. ASAMA: Builder (Derleyici)
FROM node:20 AS builder
WORKDIR /app

# pnpm kurulumu
RUN corepack enable && corepack prepare pnpm@latest --activate

# Bagimliliklari kopyala
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ESBuild kurulumu (Backend'i super hizli bundle etmek icin)
RUN npm install -g esbuild

# Tum kodu kopyala
COPY . .

# 1. Adim: Frontend Vite Build
RUN pnpm run build:client

# 2. Adim: Backend TS Build (Alias'lari cozerek, tek JS dosyasinda topla)
RUN esbuild server/server.ts --bundle --platform=node --format=esm --packages=external --tsconfig=tsconfig.server.json --outfile=dist/server.js

# 2. ASAMA: Runner (Calistirici)
FROM node:20-alpine AS runner
WORKDIR /app

# Sadece production bagimliliklarini kurmak icin pnpm lazim
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Builder'dan gelen SADECE gerekli derlenmis dosyalari al
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/scripts ./scripts

# Guvenlik ve Ortam Ayarlari
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# ESM ve Alias (Yol) kopmalarina karsi siki paketlenmis bagimsiz baslatici
CMD ["node", "dist/server.js"]
