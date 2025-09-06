module.exports = {
  apps: [
    // --- Ambiente de desenvolvimento ---
    {
      name: "dev",
      script: "./server.js",
      exp_backoff_restart_delay: 100,
      watch: true,
      ignore_watch: ["node_modules", "logs", "public", "uploads", "tmp"],
      instances: 1,
      exec_mode: "fork", // dev geralmente não precisa de cluster
      // .env.development prevalecerá caso já exista
      env: {
        NODE_ENV: "development",
        ENVIRONMENT: "DEV",
        PORT: 3001
      },
      error_file: "logs/dev-err.log",
      out_file: "logs/dev-out.log",
      log_date_format: "DD-MM-YYYY HH:mm:ss",
      max_memory_restart: "1G",
      disable_metrics: true,
      merge_logs: true,
    },

    // --- Ambiente de produção (Blue) ---
    {
      name: "blue",
      script: "./server.js",
      exp_backoff_restart_delay: 100,
      watch: false, // produção geralmente não precisa de watch
      ignore_watch: ["node_modules", "logs", "public", "uploads", "tmp"],
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        ENVIRONMENT: "BLUE",
        PORT: 3002
      },
      error_file: "logs/blue-err.log",
      out_file: "logs/blue-out.log",
      log_date_format: "DD-MM-YYYY HH:mm:ss",
      max_memory_restart: "1G",
      disable_metrics: true,
      merge_logs: true,
    },

    // --- Ambiente Green (para deploy zero downtime) ---
    {
      name: "green",
      script: "./server.js",
      exp_backoff_restart_delay: 100,
      watch: false,
      ignore_watch: ["node_modules", "logs", "public", "uploads", "tmp"],
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        ENVIRONMENT: "GREEN",
        PORT: 3003
      },
      error_file: "logs/green-err.log",
      out_file: "logs/green-out.log",
      log_date_format: "DD-MM-YYYY HH:mm:ss",
      max_memory_restart: "1G",
      disable_metrics: true,
      merge_logs: true,
    }
  ]
};
