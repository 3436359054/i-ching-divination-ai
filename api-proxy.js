#!/usr/bin/env node
/**
 * OpenRouter API 安全代理服务器
 * 用途：隐藏API密钥，防止在前端暴露
 */

// 加载环境变量
import dotenv from 'dotenv';
dotenv.config();

// 导入所需模块
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 获取当前目录路径 (ES模块替代__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 简单的请求频率限制实现
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1分钟窗口
const MAX_REQUESTS_PER_WINDOW = 5; // 每个IP每分钟最多5个请求

// 创建Express应用
const app = express();

// 配置中间件
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-username.github.io'], // 根据您的GitHub Pages URL调整
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// 获取API密钥 - 只从环境变量中读取，不在前端暴露
const API_KEY = process.env.OPENROUTER_API_KEY;
const PORT = process.env.PORT || 8080;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// 验证API密钥是否设置
if (!API_KEY) {
  console.error('错误: OPENROUTER_API_KEY 环境变量未设置');
  console.error('请在 .env 文件中添加: OPENROUTER_API_KEY=sk-or-v1-xxx');
  process.exit(1);
}

// 请求频率限制中间件
app.use((req, res, next) => {
  // 只对API路由应用频率限制
  if (req.path === '/api/get-interpretation') {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();
    
    // 清理过期的请求记录
    if (requestCounts.has(clientIP)) {
      const requests = requestCounts.get(clientIP);
      const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
      
      if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        const resetTime = Math.ceil((RATE_LIMIT_WINDOW - (now - recentRequests[0])) / 1000);
        return res.status(429).json({
          error: '请求频率过高',
          details: `每个IP每分钟最多可发送${MAX_REQUESTS_PER_WINDOW}个请求`,
          retryAfter: resetTime
        });
      }
      
      recentRequests.push(now);
      requestCounts.set(clientIP, recentRequests);
    } else {
      requestCounts.set(clientIP, [now]);
    }
  }
  
  next();
});

// 日志记录中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * 周易占卜解读API代理端点
 */
app.post('/api/get-interpretation', async (req, res) => {
  try {
    const { question, divinationData } = req.body;
    
    // 验证请求参数
    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ 
        error: '请求参数错误', 
        details: '问题描述不能为空且必须是字符串类型'
      });
    }
    
    if (!divinationData || typeof divinationData !== 'object') {
      return res.status(400).json({ 
        error: '请求参数错误', 
        details: '占卜数据不能为空且必须是对象类型'
      });
    }
    
    if (!divinationData.guaName || typeof divinationData.guaName !== 'string') {
      return res.status(400).json({ 
        error: '请求参数错误', 
        details: '卦名不能为空且必须是字符串类型'
      });
    }
    
    if (typeof divinationData.yaoIndex !== 'number' || divinationData.yaoIndex < 1 || divinationData.yaoIndex > 6) {
      return res.status(400).json({ 
        error: '请求参数错误', 
        details: '变爻索引必须是1-6之间的数字'
      });
    }
    
    const { guaName, yaoIndex } = divinationData;
    
    // 构建系统指令文本
    const systemInstructionText = `你是资深周易导师，对《周易》六十四卦及十翼有深入研究，擅长将古典智慧转化为现代可执行建议。回答时请使用地道简体中文，条理清晰，逻辑严谨。
当前用户抽得「${guaName}」，变爻为第${yaoIndex}爻。请基于本卦、变爻以及卦辞、象辞、爻辞，结合上下卦（外卦、内卦）关系，给出精准解读，并提供可操作的建议。
输出格式必须是严格的JSON对象，不要包含任何JSON之外的内容，具体格式如下：
{
  "questionBackground": {"question": "问题文本"},
  "hexagramOverview": {"hexagram": "卦名", "xiangCi": "象辞", "guaCi": "卦辞", "yaoCi": "爻辞", "fortune": "吉/凶/中性", "keyHint": "关键提示"},
  "hexagramAnalysis": {"xiangCiInterpretation": "象辞解读", "guaCiEssence": "卦辞精要", "yaoCiAnalysis": "爻辞分析", "changedHexagramAnalysis": "变卦分析"},
  "problemAnalysis": {"analysis": "问题分析", "recommendations": ["建议1", "建议2", "建议3"]},
  "reminder": "温馨提醒"
}`;
    
    // 构建请求体
    const requestBody = {
      model: 'deepseek/deepseek-chat-v3.1:free',
      messages: [
        { role: 'system', content: systemInstructionText },
        { role: 'user', content: question }
      ],
      max_tokens: 2048,
      temperature: 0.7
    };
    
    // 准备请求选项
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://your-username.github.io/i-ching-divination-ai', // 根据您的GitHub Pages URL调整
        'X-Title': 'I-Ching Divination AI'
      },
      body: JSON.stringify(requestBody),
      timeout: 30000, // 设置30秒超时
    };
    
    console.log('转发请求到OpenRouter API...');
    console.log(`请求参数: 卦名=${guaName}, 变爻=${yaoIndex}`);
    
    // 转发请求到OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, fetchOptions);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`OpenRouter API错误: ${response.status}`, errorData);
      
      // 针对401错误提供更具体的信息
      if (response.status === 401) {
        return res.status(401).json({
          error: 'API密钥无效或已过期',
          details: errorData.error?.message,
          suggestion: '请检查.env文件中的OPENROUTER_API_KEY是否正确'
        });
      }
      
      return res.status(response.status).json({
        error: 'OpenRouter API调用失败',
        details: errorData.error?.message || `HTTP ${response.status}`
      });
    }
    
    const data = await response.json();
    
    // 解析API返回的JSON结果
    let result;
    try {
      result = JSON.parse(data.choices[0].message.content);
    } catch (jsonError) {
      console.error('解析API返回结果失败:', jsonError);
      return res.status(500).json({
        error: '解析API返回结果失败',
        details: jsonError.message
      });
    }
    
    console.log('请求成功完成');
    res.json(result);
  } catch (error) {
    console.error('处理请求时发生错误:', error);
    res.status(500).json({
      error: '服务器内部错误',
      details: error.message
    });
  }
});

/**
 * 健康检查端点
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * 静态文件服务 - 用于生产环境
 */
app.use(express.static(path.join(__dirname, 'dist')));

/**
 * 处理所有未匹配的路由 - 返回前端应用
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`=== API代理服务器启动成功 ===`);
  console.log(`服务运行在: http://localhost:${PORT}`);
  console.log(`API端点: http://localhost:${PORT}/api/get-interpretation`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`OpenRouter API密钥已加载: ${API_KEY ? '是' : '否'}`);
  console.log(`注意: 请不要在前端代码中直接使用API密钥！`);
});