# ---- Stage 1: Builder ----
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Activer corepack et pnpm
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    # Copier uniquement les fichiers nécessaires à l'installation
    COPY package.json pnpm-lock.yaml ./
    
    # Installer les dépendances
    RUN pnpm install --frozen-lockfile
    
    # Copier le reste du code source
    COPY . .
    
    # Build Vite/Vike
    RUN pnpm build
    
    # ---- Stage 2: Runtime ----
    FROM node:20-alpine AS runtime
    
    WORKDIR /app
    
    # Créer un utilisateur non-root
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    
    # Activer pnpm en runtime (optionnel si pas besoin de rebuild)
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    # Copier uniquement les fichiers nécessaires
    COPY package.json pnpm-lock.yaml ./
    COPY --from=builder /app/dist ./dist
    
    # Installer uniquement les dépendances de prod
    RUN pnpm install --prod --frozen-lockfile
    
    # Propriétaire non-root
    RUN chown -R appuser:appgroup /app
    USER appuser
    
    # Variables d'env
    ENV NODE_ENV=production
    ENV HOST=0.0.0.0
    
    # Exposer le port (informatif)
    EXPOSE 3000
    
    # Entrée
    CMD ["node", "dist/server/entry-server.js"]
    