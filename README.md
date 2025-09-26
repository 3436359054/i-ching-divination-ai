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

## 注意事项

- 本应用仅供娱乐和自我反思使用
- AI解读基于周易智慧，但结果不应被视为绝对真理
- 请尊重中国传统易学文化

## License

MIT
