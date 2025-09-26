# 第一阶段：构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制项目根目录的package.json和package-lock.json
COPY package*.json ./

# 复制前端和后端目录的所有文件
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# 构建前端应用
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# 构建后端应用
WORKDIR /app/backend
RUN npm install
RUN npm run build

# 第二阶段：运行阶段
FROM node:20-alpine

WORKDIR /app

# 从构建阶段复制后端构建产物
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package*.json ./backend/

# 从构建阶段复制前端构建后的静态文件到后端的public目录
RUN mkdir -p ./backend/public
COPY --from=builder /app/frontend/dist/* ./backend/public/

# 安装后端生产依赖
WORKDIR /app/backend
RUN npm install --production

# 暴露端口
EXPOSE 3001

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "dist/index.js"]