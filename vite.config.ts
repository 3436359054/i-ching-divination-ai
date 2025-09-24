/*
 * @Author: stfly 3436359054@qq.com
 * @Date: 2025-09-23 19:02:57
 * @LastEditors: stfly 3436359054@qq.com
 * @LastEditTime: 2025-09-24 01:15:30
 * @FilePath: \i-ching-divination-ai\vite.config.ts
 * @Description: Vite配置文件 - 当前项目只使用.env文件存储环境变量
 */
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // 加载环境变量（当前只从.env文件加载）
    const env = loadEnv(mode, '.', '');
    
    // 打印加载的环境变量，用于调试
    console.log('=== Vite 环境变量调试信息 ===');
    console.log('当前模式:', mode);
    console.log('OPENROUTER_API_KEY 存在:', !!env.OPENROUTER_API_KEY);
    console.log('OPENROUTER_API_KEY 长度:', env.OPENROUTER_API_KEY ? env.OPENROUTER_API_KEY.length : 0);
    console.log('=== 调试结束 ===');
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [],
      define: {
        // 注意：这些定义主要是为了向后兼容
        // 当前项目的前端代码不再直接使用这些环境变量
        // 所有API请求都通过后端代理服务器处理
        'process.env.OPENROUTER_API_KEY': JSON.stringify(env.OPENROUTER_API_KEY),
        'import.meta.env.OPENROUTER_API_KEY': JSON.stringify(env.OPENROUTER_API_KEY)
      },
      base: '/i-ching-divination-ai/' // GitHub Pages 路径配置
    };
});
