const envConfig = {
    production: {
        NODE_ENV: 'production',
        PORT: 3000
    },
    development: {
        NODE_ENV: 'development',
        PORT: 3000
    }
};

const commonConfig = {
    env: envConfig.production,
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000,
    cwd: __dirname
};

module.exports = {
    apps: [
        {
            ...commonConfig,
            name: 'api',
            script: './dist/app.js',
            max_memory_restart: '1G',
            merge_logs: true
        },
        {
            ...commonConfig,
            name: 'email-worker',
            script: './dist/workers/processes/email.js',
            max_memory_restart: '256M'
        },
        {
            ...commonConfig,
            name: 'push-worker',
            script: './dist/workers/processes/push.js',
            max_memory_restart: '256M'
        }
    ]
};
