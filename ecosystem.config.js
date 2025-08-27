module.exports = {
  apps: [{
    name: 'gerenuk-platform',
    script: 'next',
    args: 'start',
    cwd: '.',
    instances: 1,
    exec_mode: 'fork',
    
    // 环境变量
    env: {
      NODE_ENV: 'development',
      PORT: 3030
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3030,
      LOG_LEVEL: 'error'
    },
    
    // 日志配置
    log_type: 'json',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    combine_logs: true,
    
    // 自动重启配置
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M',
    
    // 日志轮转配置
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    
    // PM2 日志轮转
    merge_logs: true,
    max_log_file_size: '10M',
    retain_log_files: 5,
    
    // 进程管理
    kill_timeout: 5000,
    listen_timeout: 8000,
    
    // 监听文件变化（仅开发环境）
    watch: false,
    ignore_watch: [
      'node_modules',
      '.next',
      'logs',
      '*.log'
    ]
  }]
};