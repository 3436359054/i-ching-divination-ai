# AI 周易卜卦应用

结合古老的周易智慧与现代AI技术，为您提供精准、有深度的卦象解读。

## 功能特点

- 🧮 基于周易六十四卦的传统占卜算法
- 🤖 利用现代AI进行卦象深度解读
- 🎨 精美的用户界面与流畅的交互体验
- 🔮 提供个性化问题解答与实用建议

## 技术栈

- **前端**：React 19、TypeScript、Vite、Tailwind CSS
- **后端**：Express、Node.js、TypeScript
- **AI 接口**：OpenRouter API（使用DeepSeek模型）

## 项目结构

```
i-ching-divination-ai/
├── frontend/          # 前端应用代码
├── backend/           # 后端API服务
├── components/        # 共享组件
├── .gitignore         # Git忽略配置
├── .dockerignore      # Docker忽略配置
├── Dockerfile         # Docker构建文件
├── package.json       # 项目依赖配置
└── README.md          # 项目说明文档
```

## 快速开始

### 前提条件

- Node.js (版本 16.x 或更高)
- npm 或 yarn 包管理器
- OpenRouter API 密钥

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/3436359054/i-ching-divination-ai.git
cd i-ching-divination-ai
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

在 `backend/` 目录下创建 `.env` 文件，并添加以下内容：

```
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=3001
```

4. **启动开发服务器**

```bash
npm run dev
```

前端应用将运行在 http://localhost:5173
后端API服务将运行在 http://localhost:3001

## 使用指南

1. 在输入框中提出您的问题
2. 输入三个三位数（000-999）作为随机数
3. 点击"确定"按钮进行占卜
4. 等待AI为您解读卦象并提供建议

## Docker 部署

### 前提条件

- 安装 [Docker](https://docs.docker.com/get-docker/)
- 拥有 [ClawCloud Run](https://claw.cloud/run) 账号

### 构建 Docker 镜像

在项目根目录执行以下命令构建Docker镜像：

```bash
docker build -t ghcr.io/3436359054/i-ching-divination-ai:latest .
```

这个命令会直接构建并标记镜像，方便后续推送到GitHub Container Registry。

如果您只想在本地测试，也可以使用更简单的标签：

```bash
docker build -t i-ching-divination-ai .
```

### 本地测试 Docker 容器

以下是在本地运行Docker镜像的详细指南，提供多种运行方式以适应不同场景：

#### 1. 使用本地构建的镜像运行

如果您已经在本地构建了镜像，可以直接运行：

```bash
docker run -p 3001:3001 --env OPENROUTER_API_KEY=your_openrouter_api_key i-ching-divination-ai
```

#### 2. 使用从GitHub Container Registry拉取的镜像运行

如果您已经将镜像推送到GitHub Container Registry，可以直接拉取并运行：

```bash
# 拉取镜像
docker pull ghcr.io/3436359054/i-ching-divination-ai:latest

# 运行镜像
docker run -p 3001:3001 --env OPENROUTER_API_KEY=your_openrouter_api_key ghcr.io/3436359054/i-ching-divination-ai:latest
```

#### 3. 运行时挂载配置文件（高级用法）

如果您有多个不同的API密钥或配置，可以使用配置文件挂载：

```bash
# 先创建.env文件，内容包含：OPENROUTER_API_KEY=your_openrouter_api_key
docker run -p 3001:3001 --env-file .env i-ching-divination-ai
```

#### 4. 持久化日志（可选）

如果需要保存应用日志，可以挂载日志目录：

```bash
docker run -p 3001:3001 --env OPENROUTER_API_KEY=your_openrouter_api_key -v $(pwd)/logs:/app/logs i-ching-divination-ai
```

#### 访问应用

运行成功后，打开浏览器访问 http://localhost:3001 测试应用

#### 查看容器运行状态

```bash
# 查看正在运行的容器
docker ps

# 查看容器日志
docker logs <container_id>

# 进入容器内部（调试用）
docker exec -it <container_id> /bin/sh
```

#### 停止和删除容器

```bash
# 停止容器
docker stop <container_id>

# 删除容器
docker rm <container_id>

# 删除镜像（可选）
docker rmi i-ching-divination-ai
```

#### 常见问题排查

- 如果无法访问 http://localhost:3001，请检查容器是否正常运行（使用`docker ps`命令）
- 如果看到API密钥相关的错误，请确认环境变量是否正确设置
- 如果遇到端口冲突，可以修改宿主机端口：`docker run -p 8080:3001 ...`（将8080替换为可用端口）

### 部署到 ClawCloud Run

1. **注册并登录 ClawCloud Run**

   - 访问 [ClawCloud Run](https://claw.cloud/run)
   - 使用 GitHub 账号注册登录（可获得每月 $5 免费额度）

2. **准备 Docker 镜像**

   由于大陆地区访问 Docker Hub 可能受限，推荐使用 GitHub Container Registry (ghcr.io)：
   
   a. **使用自动化部署脚本（推荐）**
   
   我们提供了一个自动化脚本，简化在WSL Ubuntu中构建和推送镜像的过程：
   
   ```bash
   # 设置脚本执行权限
   chmod +x setup-deploy-script.sh
   ./setup-deploy-script.sh
   
   # 运行部署脚本
   ./docker-deploy.sh
   ```
   
   脚本会引导您输入GitHub用户名和Personal Access Token，并自动完成登录、构建和推送过程。

   b. **手动构建和推送（进阶用户）**
   ```bash
   # 在 WSL Ubuntu 中登录 GitHub Container Registry
   echo "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
   
   # 构建镜像并标记
   docker build -t ghcr.io/YOUR_GITHUB_USERNAME/i-ching-divination-ai:latest .
   
   # 推送到 GitHub Container Registry
   docker push ghcr.io/YOUR_GITHUB_USERNAME/i-ching-divination-ai:latest
   ```

   > 提示：需要创建一个具有 `write:packages` 权限的 GitHub Personal Access Token (PAT)

   c. **直接在 ClawCloud Run 中构建**
   如果不想推送镜像，也可以使用项目自带的 Dockerfile 在 ClawCloud Run 中直接构建

   ### Dockerfile 修改说明
   
   我们更新了Dockerfile，使用改进的多阶段构建流程：
   
   - 在构建阶段完成前端和后端的构建（包括TypeScript编译）
   - 在运行阶段只复制构建好的JavaScript文件和安装生产依赖
   - 这样解决了之前`tsc: not found`的编译错误
   - 同时减小了最终镜像的大小

3. **在 ClawCloud Run 中部署**

   - 登录后，在控制台点击 "App Launchpad"
   - 点击 "Add App"
   - 选择 "Deploy from Image"
   - 输入 Docker 镜像名称（如 `ghcr.io/YOUR_GITHUB_USERNAME/i-ching-divination-ai:latest`）
   - 设置环境变量：
     - `OPENROUTER_API_KEY`: 你的 OpenRouter API 密钥
     - `PORT`: 3001
   - 设置容器端口为 3001
   - 点击 "Deploy App"

4. **访问应用**

   部署完成后，ClawCloud Run 会提供一个公共 URL，你可以通过这个 URL 访问你的应用。

## 注意事项

- 本应用仅供娱乐和自我反思使用
- AI解读基于周易智慧，但结果不应被视为绝对真理
- 请尊重中国传统易学文化
- ClawCloud Run 提供的免费额度包含每月 $5 信用和 10GB 流量，请留意使用情况

## License

MIT
