#!/usr/bin/env bash
# Redeploy Brother Studios on the Hostinger EasyPanel VPS.
# Deployed as a standalone Docker container on the shared `easypanel` overlay
# network; Traefik routes it via container labels and issues SSL (letsencrypt).
# This is additive — it never touches the other EasyPanel/Traefik apps.
#
# Run on the server:  bash /opt/brotherstudio/deploy/redeploy.sh
set -eo pipefail

cd /opt/brotherstudio
git fetch -q origin main && git reset -q --hard origin/main
docker build -t brotherstudio:latest .
docker rm -f brotherstudio 2>/dev/null || true
docker run -d --name brotherstudio --restart unless-stopped --network easypanel \
  -l traefik.enable=true \
  -l 'traefik.http.routers.brotherstudio-http.rule=Host(`brotherstudio.pro`) || Host(`www.brotherstudio.pro`)' \
  -l traefik.http.routers.brotherstudio-http.entrypoints=http \
  -l traefik.http.routers.brotherstudio-http.middlewares=redirect-to-https@file \
  -l 'traefik.http.routers.brotherstudio.rule=Host(`brotherstudio.pro`) || Host(`www.brotherstudio.pro`)' \
  -l traefik.http.routers.brotherstudio.entrypoints=https \
  -l traefik.http.routers.brotherstudio.tls.certresolver=letsencrypt \
  -l traefik.http.services.brotherstudio.loadbalancer.server.port=3000 \
  brotherstudio:latest
echo "✓ redeployed — https://brotherstudio.pro"
