# Nexus Monorepo

Repo jest przygotowane jako monorepo z `pnpm` i `turbo`.

## Struktura

- `Frontend` - aplikacja React/Vite
- `Backend` - backend C# / ASP.NET Core

## Start

```bash
pnpm install
pnpm dev
```

## Przydatne komendy

```bash
pnpm dev:frontend
pnpm dev:backend
pnpm build
pnpm test
pnpm lint
```

## Backend

Backend działa jako solution `.NET` z projektem API:

- `Backend/Nexus.sln`
- `Backend/src/Nexus.Api`
