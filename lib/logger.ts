// 生产环境日志工具函数
const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

export const logger = {
  // 仅在开发/测试环境输出详细日志
  debug: (message: any, ...args: any[]) => {
    if (isDev || isTest) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  
  // 信息日志 - 生产环境也输出
  info: (message: any, ...args: any[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  
  // 警告日志
  warn: (message: any, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  
  // 错误日志 - 始终输出
  error: (message: any, error?: any, ...args: any[]) => {
    if (error) {
      console.error(`[ERROR] ${message}`, error, ...args);
    } else {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  
  // API 调用日志 - 仅开发环境
  api: (method: string, url: string, status?: number, duration?: number) => {
    if (isDev) {
      const statusText = status ? `${status}` : 'pending';
      const durationText = duration ? `${duration}ms` : '';
      console.log(`[API] ${method} ${url} ${statusText} ${durationText}`);
    }
  }
};

// 替代 console.log 的快捷函数
export const log = {
  // 开发环境专用日志
  dev: (...args: any[]) => {
    if (isDev) {
      console.log('[DEV]', ...args);
    }
  },
  
  // 条件日志
  if: (condition: boolean, ...args: any[]) => {
    if (condition && (isDev || isTest)) {
      console.log('[CONDITIONAL]', ...args);
    }
  }
};