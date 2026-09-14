module.exports = {
  apps: [
    {
      name: "airdochealth",
      script: "npm",
      args: "start",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3005,
        ADMIN_NOTIFICATION_EMAIL: "founders@airdochealth.com",
      },
    },
  ],
};
