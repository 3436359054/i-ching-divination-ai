import express from 'express';
import cors from 'cors';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// 从环境变量中获取 API 密钥
const openrouterApiKey = process.env.OPENROUTER_API_KEY;
if (!openrouterApiKey) {
  console.error("OPENROUTER_API_KEY environment variable not set. Please set it in your .env file.");
  process.exit(1); // 如果没有密钥，则退出
}

app.use(cors());
app.use(express.json());

// 使用 express.static 中间件来提供前端构建后的静态文件
const staticFilesPath = path.join(__dirname, '..', 'public');
// 确保Express能够正确处理静态资源请求
app.use(express.static(staticFilesPath, {
  // 确保所有静态文件都能被正确提供
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Deepseek API 路由
app.post('/api/get-interpretation', async (req, res) => {
  const { question, hexagramName, lineText } = req.body;

  if (!question || !hexagramName || !lineText) {
    return res.status(400).json({ error: 'Missing required parameters: question, hexagramName, lineText' });
  }

  try {
    const prompt = `
      你是一位资深周易导师，对《周易》六十四卦有深入研究，擅长将古典智慧转化为现代可执行建议。请为用户提供一次精准、条理清晰的卜卦解读。

      用户的提问是：
      "${question}"

      卜算出的卦象是：
      ${hexagramName}

      对应的爻辞是：
      "${lineText}"

      ---

      请严格遵循以下格式进行输出，保留【】标题和 • 项目符号:

      【问题】
      • ${question}

      【卦象总览】
      • 本卦：${hexagramName}
      • 爻辞：${lineText}
      • 关键提示：[请用一句话提炼本次占卜的核心信息]

      【卦象分析】
      • 卦象总解：[请用现代语言解读 "${hexagramName}" 的整体含义、象征以及其上下卦的关系]
      • 爻辞精解：[请深入分析 "${lineText}" 这句爻辞的含义，以及它在此卦中的具体指示]

      【结合问题解答】
      • [请将上述分析与用户的具体问题 "${question}" 紧密结合，给出明确的、可操作的建议。如果问题需要结论，请直接给出结论。]

      【总结启示】
      • [请用一两句富有哲理的话总结本次占卜的最终启示。]
    `;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openrouterApiKey}`,
        'HTTP-Referer': 'http://localhost:5173' // 前端应用的URL
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3.1:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get interpretation from Deepseek API.');
    }

    const interpretation = data.choices[0]?.message?.content || '';
    res.json({ interpretation });
  } catch (error) {
    console.error("Error in /api/get-interpretation:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "AI解读时发生错误，请稍后再试。"
    });
  }
});

// 对于所有其他路由，返回前端的 index.html
// 注意：这个路由应该放在所有API路由之后
app.get('*', (req, res) => {
  // 只对非API请求返回index.html，让静态文件中间件处理静态资源
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(staticFilesPath, 'index.html'));
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
