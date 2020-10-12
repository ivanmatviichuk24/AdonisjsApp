module.exports = {
  apps: [{
    name: 'app',
    script: './server.js',
    watch: true,
    exec_mode: 'cluster_mode',
    instances: 1,
    ignore_watch: ["node_modules", "public", "tmp"],
    watch_options: {
      "usePolling": true,
    }
  }],
  /*
    deploy: {
      production: {
        user: 'SSH_USERNAME',
        host: 'SSH_HOSTMACHINE',
        ref: 'origin/master',
        repo: 'GIT_REPOSITORY',
        path: 'DESTINATION_PATH',
        'pre-deploy-local': '',
        'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
        'pre-setup': ''
      }
    }*/
};
