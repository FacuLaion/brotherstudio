# Deploy — Brother Studios → VPS Hostinger (brotherstudio.pro)

Next.js en modo `standalone` detrás de **PM2** (proceso Node) + **Nginx** (reverse proxy + TLS) con **Let's Encrypt**. El puerto 3000 queda solo en localhost; Nginx es la puerta pública.

---

## 0. Antes de empezar necesitás
- VPS Hostinger con **Ubuntu 22.04/24.04 LTS** y su **IP pública**.
- Acceso **SSH** (root al inicio).
- El dominio **brotherstudio.pro** (en Hostinger u otro registrador) para apuntar DNS.

## 1. Apuntar el DNS (hacelo primero, tarda en propagar)
En el panel de tu dominio, creá dos registros **A**:
- `@`   → `IP_DEL_VPS`
- `www` → `IP_DEL_VPS`

Verificá antes de seguir con SSL:
```bash
dig +short brotherstudio.pro
dig +short www.brotherstudio.pro
```
Ambos deben devolver la IP del VPS.

## 2. Hardening del servidor (SSH como root)
```bash
adduser deploy && usermod -aG sudo deploy
# copiá tu clave SSH:  ssh-copy-id deploy@IP_DEL_VPS  (desde tu Mac)
# luego, en /etc/ssh/sshd_config: PermitRootLogin no  /  PasswordAuthentication no
sudo systemctl restart ssh

sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 3. Node + pnpm + PM2 (como `deploy`)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install --lts            # Node 20/22
corepack enable && corepack prepare pnpm@latest --activate
npm install -g pm2
# Si el VPS tiene <=2GB RAM, agregá swap para que el build no muera:
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 4. Subir el código
**Opción A — git** (recomendado): subí `web/` a un repo y cloná:
```bash
mkdir -p ~/apps && cd ~/apps
git clone TU_REPO brotherstudio && cd brotherstudio
```
**Opción B — rsync desde tu Mac** (sin repo):
```bash
# desde la carpeta web/ en tu Mac (excluye node_modules y .next):
rsync -az --exclude node_modules --exclude .next --exclude certs ./ deploy@IP_DEL_VPS:~/apps/brotherstudio/
```

## 5. Build + arrancar con PM2 (en el VPS, dentro de la carpeta)
```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh          # instala, buildea, copia assets, arranca PM2
pm2 startup                 # ejecutá la línea que imprime (para que sobreviva reboots)
pm2 save
```
Comprobá local: `curl -I http://127.0.0.1:3000` → 200.

## 6. Nginx
```bash
sudo apt update && sudo apt install -y nginx
sudo cp deploy/nginx.conf /etc/nginx/sites-available/brotherstudio.pro
sudo ln -s /etc/nginx/sites-available/brotherstudio.pro /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

## 7. SSL (Let's Encrypt) — cuando el DNS ya resuelve
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d brotherstudio.pro -d www.brotherstudio.pro
sudo certbot renew --dry-run
```
Certbot reescribe Nginx para HTTPS y agrega el redirect 80→443.

## 8. Verificar
```bash
curl -I https://www.brotherstudio.pro        # 200 + headers
```
Abrí el sitio: la escena WebGL carga, y el **modo inmersivo** (cámara/gestos/gaze) ya funciona porque hay **HTTPS real**.

---

## Re-deploys
```bash
cd ~/apps/brotherstudio && git pull && ./deploy/deploy.sh
```

## Notas
- Antes de cambios grandes: tomá un **snapshot** del VPS en Hostinger.
- `pm2 logs brotherstudio` para ver logs; logs de Nginx en `/var/log/nginx/`.
- Videos pesados (showcase): ponelos en `public/media/` — Nginx los sirve con cache + byte-range.
