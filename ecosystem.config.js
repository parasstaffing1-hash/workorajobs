module.exports = {
  apps: [
    {
      name: "workora-web",
      script: "server.js",
      cwd: "/opt/workora/runtime",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "384M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  ],
};
