#!/bin/bash

# 部署脚本 - 长颈羚数字信息管理平台
# 用于将项目部署到生产服务器

set -e  # 遇到错误立即退出

# 配置变量
SERVER_HOST="100.72.60.117"
SERVER_PORT="2222"
SERVER_USER="wsuo"
PROJECT_NAME="gerenuk-platform"
REMOTE_PATH="/home/wsuo/${PROJECT_NAME}"
LOCAL_BUILD_PATH=".next"
PM2_APP_NAME="gerenuk-platform"

# 清理函数 - 确保临时文件始终被清理
cleanup() {
  if [ -n "${DEPLOY_DIR}" ] && [ -d "${DEPLOY_DIR}" ]; then
    echo "🧹 清理本地临时文件..."
    rm -rf "${DEPLOY_DIR}"
    echo "✅ 临时文件清理完成"
  fi
}

# 设置退出时清理
trap cleanup EXIT

echo "🚀 开始部署长颈羚数字信息管理平台..."

# 1. 检查是否有未提交的变更
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ 检测到未提交的变更，请先提交代码"
  git status --short
  exit 1
fi

echo "✅ Git状态检查通过"

# 2. 构建项目
echo "📦 开始构建项目..."
npm run build
echo "✅ 项目构建完成"

# 3. 创建部署包
echo "📁 创建部署包..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOY_DIR="deploy_${TIMESTAMP}"
mkdir -p ${DEPLOY_DIR}

# 复制必要的文件
cp -r .next ${DEPLOY_DIR}/
cp -r public ${DEPLOY_DIR}/
cp package.json ${DEPLOY_DIR}/
cp package-lock.json ${DEPLOY_DIR}/
cp next.config.mjs ${DEPLOY_DIR}/
cp .env.prod ${DEPLOY_DIR}/.env.production
cp -r lib ${DEPLOY_DIR}/
cp -r components ${DEPLOY_DIR}/
cp -r app ${DEPLOY_DIR}/
cp -r hooks ${DEPLOY_DIR}/
cp -r contexts ${DEPLOY_DIR}/
cp -r middleware.ts ${DEPLOY_DIR}/
cp tailwind.config.ts ${DEPLOY_DIR}/
cp tsconfig.json ${DEPLOY_DIR}/

# 创建PM2配置文件
cat > ${DEPLOY_DIR}/ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: '${PM2_APP_NAME}',
      script: 'npm',
      args: 'start',
      cwd: '${REMOTE_PATH}',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3030,
        NODE_OPTIONS: '--max-old-space-size=512'
      },
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '512M'
    }
  ]
}
EOF

echo "✅ 部署包创建完成: ${DEPLOY_DIR}"

# 4. 上传到服务器
echo "📤 上传文件到服务器..."
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${REMOTE_PATH}"
rsync -avz --delete -e "ssh -p ${SERVER_PORT}" ${DEPLOY_DIR}/ ${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH}/

echo "✅ 文件上传完成"

# 5. 在服务器上安装依赖和启动服务
echo "🔧 在服务器上配置服务..."
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} << EOF
# 设置环境变量和PATH
export HOME=/home/wsuo
export PATH="\$HOME/nodejs/bin:\$PATH"

# 检查Node.js和npm
echo "🔍 检查Node.js和npm版本..."
node --version
npm --version

cd ${REMOTE_PATH}
echo "📦 安装生产依赖..."
npm ci --only=production

echo "📁 创建日志目录..."
mkdir -p logs

echo "🔄 重启PM2服务..."
pm2 delete ${PM2_APP_NAME} 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup --ubuntu -u wsuo --hp /home/wsuo

echo "✅ 服务启动完成"
pm2 status
EOF

echo "🎉 部署完成！"
echo "📊 查看服务状态: ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} 'pm2 status'"
echo "📝 查看服务日志: ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} 'pm2 logs ${PM2_APP_NAME}'"
echo "🌐 服务将运行在: http://${SERVER_HOST}:3030"
echo ""
echo "接下来需要配置Cloudflare Tunnel:"
echo "1. 修改服务器上的 ~/.cloudflared/config.yml"
echo "2. 添加域名映射: cloudflared tunnel route dns 12664a93-e760-42a5-bf84-58a99867cab4 gerenuk-platform.wsuo.top"
echo "3. 重启cloudflared服务: systemctl restart cloudflared"