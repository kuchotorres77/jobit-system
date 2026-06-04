module.exports = {
  apps: [{
    name: 'api',
    script: './dist/app.js',
    watch: true,
    autorestart: true,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    }
  }]
};