/*
 * @Author: stfly 3436359054@qq.com
 * @Date: 2025-09-23 19:02:57
 * @LastEditors: stfly 3436359054@qq.com
 * @LastEditTime: 2025-09-23 19:08:26
 * @FilePath: \i-ching-divination-ai\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [],
      define: {
        'process.env.OPENROUTER_API_KEY': JSON.stringify(env.OPENROUTER_API_KEY)
      }
    };
});
