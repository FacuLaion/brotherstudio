// PM2 process config — Brother Studios (Next.js standalone).
// Usage on the VPS:  pm2 start ecosystem.config.js  &&  pm2 save
const path = require("path");

module.exports = {
  apps: [
    {
      name: "brotherstudio",
      script: path.join(__dirname, ".next/standalone/server.js"),
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        // Bind to localhost only — Nginx is the public entrypoint.
        HOSTNAME: "127.0.0.1",
        PORT: 3000,
      },
    },
  ],
};
