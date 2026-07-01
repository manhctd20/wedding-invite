# syntax=docker/dockerfile:1

# ---------- Stage 1: build tĩnh bằng Vite ----------
FROM node:20-alpine AS build
WORKDIR /app

# Cài dependencies (gồm devDeps: vite, tailwind, postcss — cần cho build)
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .

# API base URL nhúng lúc build. Mặc định '/api' (cùng origin, nginx sẽ proxy).
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- Stage 2: serve tĩnh + reverse-proxy /api ----------
FROM nginx:1.27-alpine

# Cấu hình nginx: SPA fallback + proxy /api -> backend:4000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy artifact build vào web root
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
