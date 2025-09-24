# 周易占卜 AI 应用

一个基于 OpenRouter API 和 DeepSeek 模型的智能周易占卜应用。用户可以提出问题，系统通过周易占卜算法生成卦象，并结合 AI 给出详细解读和建议。

## 🚀 功能特点

- **智能占卜**：结合传统周易算法和现代 AI 技术
- **详细解读**：提供卦辞、爻辞分析以及针对问题的具体建议
- **用户友好**：简洁直观的界面设计，操作便捷
- **响应式布局**：适配各种屏幕尺寸的设备
- **安全的 API 调用**：通过后端代理服务器保护 API 密钥不被暴露

## 🛠️ 技术栈

- HTML/CSS/JavaScript
- React 18
- Tailwind CSS
- Vite
- Express（后端代理服务器）
- OpenRouter API (DeepSeek 模型)

## 📥 安装指南

### 前提条件

- Node.js 16+ 和 npm 8+

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/i-ching-divination-ai.git
   cd i-ching-divination-ai
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置 API 密钥**
   在项目根目录创建或编辑 `.env` 文件，并添加 OpenRouter API 密钥：
   ```env
   OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   > **重要说明**：
   > - 当前项目**只需要使用 `.env` 文件**即可，不需要创建其他 `.env.*` 文件
   > - API 密钥只应存储在服务器端，不应暴露在前端代码中！
   > - `.env` 文件已在 `.gitignore` 中配置，不会被提交到版本控制

## 🔐 安全的 API 调用机制

本项目采用后端代理服务器模式处理 API 请求，确保 API 密钥的安全：

1. **前端**：不直接包含或使用 API 密钥
2. **后端代理**：在服务器端存储和使用 API 密钥，向前端提供安全的接口
3. **环境隔离**：开发环境和生产环境使用不同的配置

## 💻 本地开发流程

### 方式一：分别启动前后端（推荐）

1. **启动前端开发服务器**
   ```bash
   npm run dev
   ```
   前端应用将在 http://localhost:3000 运行

2. **在另一个终端启动 API 代理服务器**
   ```bash
   npm run api-server
   ```
   API 代理服务器将在 http://localhost:8080 运行

### 方式二：同时启动前后端

```bash
npm run dev-with-api
```

这将同时启动前端开发服务器和 API 代理服务器。

## 🚀 生产环境部署

### 1. 前端部署（GitHub Pages）

```bash
npm run build
npm run deploy
```

### 2. 后端代理服务器部署

为了确保 API 密钥的安全，您需要将后端代理服务器部署到一个安全的服务器上。推荐的部署平台包括：

- [Heroku](https://www.heroku.com/)
- [Vercel](https://vercel.com/)
- [Render](https://render.com/)
- [Railway](https://railway.app/)

#### 部署步骤

1. **准备部署文件**
   需要部署的核心文件：
   - `api-proxy.js`
   - `package.json`
   - `.env`（包含 API 密钥，但不要提交到版本控制）

2. **配置环境变量**
   在您选择的平台上，设置环境变量：
   - `OPENROUTER_API_KEY`: 您的 OpenRouter API 密钥
   - `PORT`: 服务器端口（通常由平台自动设置）

3. **更新前端配置**
   在 `deepseek-api.js` 文件中，更新 GitHub Pages 环境下的代理服务器 URL：
   ```javascript
   // GitHub Pages环境，应使用部署的后端代理服务
   proxyServerUrl = 'https://your-backend-service.example.com'; // 替换为您的实际后端服务URL
   ```

## 🔧 问题排查指南

### 🐛 常见错误及解决方案

1. **无法连接到代理服务器**
   - 确认 API 代理服务器正在运行
   - 检查网络连接是否正常
   - 验证代理服务器的 CORS 配置是否允许您的域名访问

2. **401 认证错误**
   - 检查 `.env` 文件中的 API 密钥是否正确
   - 确认 API 密钥格式是否以 `sk-or-v1-` 开头
   - 登录 OpenRouter 官网确认密钥有效性
   - 重启代理服务器以加载最新的环境变量

3. **500 内部服务器错误**
   - 查看代理服务器日志获取详细错误信息
   - 确认代理服务器可以正常连接到 OpenRouter API

### 🌐 跨域资源共享 (CORS) 问题

如果遇到 CORS 相关错误，请检查 `api-proxy.js` 文件中的 CORS 配置，确保允许您的前端应用域名访问：

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-username.github.io'], // 根据实际情况调整
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
```

## 项目结构

- `index.html`：主页面文件，包含完整的应用程序代码
- `deepseek-api.js`：安全的 API 调用模块，通过代理服务器访问 OpenRouter API
- `api-proxy.js`：后端 API 代理服务器，保护 API 密钥不被暴露
- `vite.config.ts`：Vite 构建配置
- `.env`：环境变量配置文件（不应提交到版本控制）

## 🔒 安全最佳实践

1. **永远不要**在前端代码中直接使用或暴露 API 密钥
2. **永远不要**将包含 API 密钥的文件提交到版本控制
3. **使用环境变量**存储敏感信息
4. **限制 API 密钥的权限**：在 OpenRouter 控制台为密钥设置最小必要权限
5. **定期轮换 API 密钥**：提高安全性
6. **监控 API 使用情况**：定期检查 API 调用记录，发现异常及时处理

## 注意事项

- 本应用仅供娱乐和学习目的使用
- 周易占卜结果应作为参考，不应用于重大决策
- 请确保遵守 OpenRouter API 的使用条款和服务协议

## 许可证

MIT License
