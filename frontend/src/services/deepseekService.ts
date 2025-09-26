export const getInterpretation = async (
  question: string,
  hexagramName: string,
  lineText: string
): Promise<string> => {
  try {
    const response = await fetch('/api/get-interpretation', {
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