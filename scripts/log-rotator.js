#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 日志轮转配置
const LOG_DIR = path.join(process.cwd(), 'logs');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 10; // 保留最多10个历史文件
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// 获取当前时间戳
function getTimestamp() {
  return new Date().toISOString();
}

// 获取日志文件路径
function getLogFilePath() {
  const date = new Date().toISOString().split('T')[0];
  return path.join(LOG_DIR, `app-${date}.log`);
}

// 轮转日志文件
function rotateLogFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  const stats = fs.statSync(filePath);
  if (stats.size < MAX_FILE_SIZE) return;
  
  // 创建备份文件
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = filePath.replace('.log', `-${timestamp}.log`);
  
  try {
    fs.renameSync(filePath, backupPath);
    console.error(`[LOG-ROTATOR] 轮转日志文件: ${backupPath}`);
    
    // 清理旧日志文件
    cleanOldLogFiles();
  } catch (error) {
    console.error(`[LOG-ROTATOR] 轮转日志失败: ${error.message}`);
  }
}

// 清理旧日志文件
function cleanOldLogFiles() {
  try {
    const files = fs.readdirSync(LOG_DIR)
      .filter(file => file.endsWith('.log'))
      .map(file => ({
        name: file,
        path: path.join(LOG_DIR, file),
        mtime: fs.statSync(path.join(LOG_DIR, file)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime);
    
    // 删除超过限制的文件
    if (files.length > MAX_FILES) {
      files.slice(MAX_FILES).forEach(file => {
        try {
          fs.unlinkSync(file.path);
          console.error(`[LOG-ROTATOR] 删除旧日志文件: ${file.name}`);
        } catch (error) {
          console.error(`[LOG-ROTATOR] 删除文件失败: ${error.message}`);
        }
      });
    }
  } catch (error) {
    console.error(`[LOG-ROTATOR] 清理旧文件失败: ${error.message}`);
  }
}

// 过滤日志级别
function shouldLogMessage(message) {
  const lowerMessage = message.toLowerCase();
  
  // 过滤掉不必要的日志
  const noisePatterns = [
    'compiled successfully',
    'fast refresh',
    'webpack compiled',
    'ready - started server',
    'ready - local:'
  ];
  
  if (LOG_LEVEL === 'error' && !lowerMessage.includes('error') && !lowerMessage.includes('fail')) {
    return false;
  }
  
  return !noisePatterns.some(pattern => lowerMessage.includes(pattern));
}

// 主要日志处理逻辑
function processLogMessage(data) {
  const message = data.toString();
  if (!shouldLogMessage(message)) return;
  
  const logFilePath = getLogFilePath();
  const timestamp = getTimestamp();
  const logEntry = `[${timestamp}] ${message}`;
  
  // 检查是否需要轮转
  rotateLogFile(logFilePath);
  
  // 写入日志文件
  try {
    fs.appendFileSync(logFilePath, logEntry);
  } catch (error) {
    console.error(`[LOG-ROTATOR] 写入日志失败: ${error.message}`);
  }
  
  // 同时输出到控制台（开发环境）
  if (process.env.NODE_ENV !== 'production') {
    process.stdout.write(logEntry);
  }
}

// 处理标准输入流
process.stdin.on('data', processLogMessage);
process.stdin.on('end', () => {
  console.error('[LOG-ROTATOR] 日志流结束');
});

// 处理退出信号
process.on('SIGINT', () => {
  console.error('[LOG-ROTATOR] 接收到退出信号，正在清理...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('[LOG-ROTATOR] 接收到终止信号，正在清理...');
  process.exit(0);
});

console.error(`[LOG-ROTATOR] 日志轮转器已启动，日志目录: ${LOG_DIR}`);
console.error(`[LOG-ROTATOR] 配置 - 最大文件大小: ${MAX_FILE_SIZE / 1024 / 1024}MB, 最大文件数: ${MAX_FILES}, 日志级别: ${LOG_LEVEL}`);