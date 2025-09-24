/**
 * OpenRouter API 安全调用模块
 * 通过后端代理服务器调用OpenRouter API，保护API密钥不被暴露
 * 
 * 重要提示：
 * - 此模块不再在前端直接使用API密钥
 * - 所有API请求通过后端代理服务器转发
 * - 本地开发时，请确保API代理服务器已启动
 */

/**
 * 获取周易占卜解读
 * @param {string} question - 用户提问
 * @param {Object} divinationData - 占卜数据
 * @param {Object} options - 可选配置
 * @param {number} options.maxRetries - 最大重试次数（默认3次）
 * @param {number} options.retryDelay - 重试间隔（默认1000毫秒）
 * @returns {Promise<Object>} 解读结果
 */
export async function getInterpretation(question, divinationData, options = {}) {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  const { guaName, yaoIndex } = divinationData;
  
  // 检测当前环境
  const isGitHubPages = window.location.href.includes('github.io');
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // 根据环境确定代理服务器地址
  let proxyServerUrl;
  if (isLocalhost) {
    // 本地开发环境使用localhost代理服务器
    proxyServerUrl = 'http://localhost:8080';
  } else if (isGitHubPages) {
    // GitHub Pages环境，应使用部署的后端代理服务
    // 注意：这里需要替换为您实际部署的后端服务URL
    // 例如: 'https://your-backend-service.herokuapp.com'
    proxyServerUrl = 'https://your-backend-service.example.com';
  } else {
    // 其他环境使用当前域名的API路径
    proxyServerUrl = ''; // 空字符串表示使用相对路径
  }
  
  // 构建代理API端点URL
  const apiEndpoint = `${proxyServerUrl}/api/get-interpretation`;
  
  console.log('=== API请求信息 ===');
  console.log('当前环境:', isGitHubPages ? 'GitHub Pages' : isLocalhost ? '本地开发' : '其他环境');
  console.log('代理服务器URL:', proxyServerUrl);
  console.log('API端点:', apiEndpoint);
  console.log('请求参数:', { question, divinationData });
  
  // 构建请求体
  const requestBody = {
    question,
    divinationData
  };
  
  let retries = 0;
  let lastError;
  
  while (retries <= maxRetries) {
    if (retries > 0) {
      console.log(`第${retries}次重试请求...`);
      // 指数退避策略
      const delay = retryDelay * Math.pow(2, retries - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    try {
      // 准备请求选项
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'omit', // 确保不发送cookies
        mode: 'cors', // 明确设置CORS模式
        cache: 'no-cache' // 禁用缓存，确保每次都是新请求
      };
      
      console.log('发送请求到代理服务器...');
      
      // 调用代理服务器API
      const response = await fetch(apiEndpoint, fetchOptions);
      
      console.log('代理服务器响应状态码:', response.status);
      
      if (!response.ok) {
        // 克隆response对象，避免body stream already read错误
        const clonedResponse = response.clone();
        try {
          const errorData = await response.json();
          console.error('代理服务器返回错误:', errorData);
          
          // 针对常见错误提供具体的排查建议
          if (response.status === 401) {
            let errorMessage = `API调用失败: ${errorData.error || errorData.message || `HTTP ${response.status}`}`;
            errorMessage += '\n\n重要提示：这通常表示后端代理服务器的API密钥无效或已过期！';
            errorMessage += '\n\n解决步骤：';
            errorMessage += '\n1. 确保后端代理服务器已正确配置API密钥';
            errorMessage += '\n2. 检查.env文件中的OPENROUTER_API_KEY是否正确';
            errorMessage += '\n3. 重启后端代理服务器以加载最新配置';
            
            // 针对本地开发环境的建议
            if (isLocalhost) {
              errorMessage += '\n\n本地开发环境检查：';
              errorMessage += '\n- 确认API代理服务器正在运行（npm run api-server）';
              errorMessage += '\n- 检查服务器控制台输出是否有错误信息';
            }
            
            // 针对GitHub Pages环境的建议
            if (isGitHubPages) {
              errorMessage += '\n\nGitHub Pages环境说明：';
              errorMessage += '\n- 确保您已部署后端代理服务并正确配置了API密钥';
              errorMessage += '\n- 检查deepseek-api.js中的代理服务器URL是否正确';
            }
            
            throw new Error(errorMessage);
          } else if (response.status === 429) {
            // 请求频率过高 - 不应重试
            let errorMessage = `API调用失败: ${errorData.error || errorData.message || `HTTP ${response.status}`}`;
            errorMessage += '\n\n重要提示：您的请求频率过高，请稍后再试！';
            errorMessage += `\n\n建议等待${errorData.retryAfter || 60}秒后重试`;
            
            throw new Error(errorMessage);
          } else if (response.status === 500) {
            // 服务器错误 - 可以重试
            lastError = errorData;
            retries++;
            if (retries > maxRetries) {
              let errorMessage = `API调用失败: ${errorData.error || errorData.message || `HTTP ${response.status}`}`;
              errorMessage += '\n\n重要提示：这通常表示后端代理服务器发生内部错误！';
              errorMessage += '\n\n解决步骤：';
              errorMessage += '\n1. 检查后端代理服务器的运行状态';
              errorMessage += '\n2. 查看服务器日志获取详细错误信息';
              
              if (isLocalhost) {
                errorMessage += '\n\n本地开发环境检查：';
                errorMessage += '\n- 执行 npm run api-server 启动代理服务器';
                errorMessage += '\n- 观察控制台输出的错误信息';
              }
              
              throw new Error(errorMessage);
            }
            continue; // 继续重试
          } else if (response.status === 0 || !response.status) {
            // 网络错误 - 可以重试
            lastError = { error: '网络错误' };
            retries++;
            if (retries > maxRetries) {
              let errorMessage = 'API调用失败: 无法连接到代理服务器！';
              errorMessage += '\n\n重要提示：这通常表示网络连接问题或CORS配置错误！';
              errorMessage += '\n\n解决步骤：';
              errorMessage += '\n1. 检查网络连接是否正常';
              errorMessage += '\n2. 确认代理服务器地址是否正确';
              errorMessage += '\n3. 检查代理服务器的CORS配置是否允许当前域名访问';
              
              if (isLocalhost) {
                errorMessage += '\n\n本地开发环境检查：';
                errorMessage += '\n- 确认API代理服务器正在运行（npm run api-server）';
                errorMessage += '\n- 检查api-proxy.js中的CORS配置是否包含了localhost:3000';
              }
              
              throw new Error(errorMessage);
            }
            continue; // 继续重试
          } else {
            // 其他错误 - 可以重试
            lastError = errorData;
            retries++;
            if (retries > maxRetries) {
              throw new Error(`API调用失败: ${errorData.error || errorData.message || `HTTP ${response.status}`}`);
            }
            continue; // 继续重试
          }
        } catch (jsonError) {
          const responseText = await clonedResponse.text();
          console.error('无法解析的错误响应:', responseText);
          lastError = { error: '无法解析错误响应' };
          retries++;
          if (retries > maxRetries) {
            throw new Error(`API调用失败: 无法解析错误响应\n状态码: ${response.status}\n原始响应: ${responseText}`);
          }
          continue; // 继续重试
        }
      }

      const result = await response.json();
      
      console.log('API请求成功完成');
      
      return result;
    } catch (error) {
      console.error(`请求失败 (${retries}/${maxRetries}):`, error);
      lastError = error;
      retries++;
      if (retries > maxRetries) {
        console.error('所有重试都失败了:', error);
        throw error;
      }
    }
  }
  
  // 所有重试都失败了
  console.error('所有重试都失败了:', lastError);
  throw lastError;
}