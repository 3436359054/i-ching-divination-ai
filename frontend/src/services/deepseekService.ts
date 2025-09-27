/*
 * @Author: stfly 3436359054@qq.com
 * @Date: 2025-09-26 17:41:30
 * @LastEditors: stfly 3436359054@qq.com
 * @LastEditTime: 2025-09-27 17:29:54
 * @FilePath: \i-ching-divination-ai\frontend\src\services\deepseekService.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const getInterpretation = async (
  question: string,
  hexagramName: string,
  lineText: string
): Promise<string> => {
  try {
    const response = await fetch('/api/get-interpretation/ali/deepseek31', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, hexagramName, lineText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch interpretation from backend.');
    }

    const data = await response.json();
    return data.interpretation;
  } catch (error) {
    console.error("Error fetching interpretation from backend:", error);
    throw new Error("与服务器通信时发生错误，请稍后再试。");
  }
};