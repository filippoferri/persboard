module.exports = {
  apps: [
    {
      name: 'nextjs-dev',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3034
      },
      watch: false,
      ignore_watch: ['node_modules', '.next'],
      log_file: './logs/app.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      time: true
    }
  ]
};