#!/usr/bin/env bash
# Build + (re)start Brother Studios on the VPS. Run from the app directory.
set -euo pipefail

echo "→ Installing dependencies (frozen lockfile)"
pnpm install --frozen-lockfile

echo "→ Building (Next.js standalone)"
pnpm build

# Next standalone does NOT copy these automatically:
echo "→ Copying static assets + public/ into standalone"
rm -rf .next/standalone/.next/static
cp -r .next/static .next/standalone/.next/static
rm -rf .next/standalone/public
cp -r public .next/standalone/public

echo "→ Reloading PM2"
if pm2 describe brotherstudio > /dev/null 2>&1; then
  pm2 reload ecosystem.config.js --update-env
else
  pm2 start ecosystem.config.js
fi
pm2 save

echo "✓ Deploy complete — https://brotherstudio.pro"
