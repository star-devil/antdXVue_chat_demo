/** AI生成，不保证可用性，请自行替换 */
interface ChatStreamOptions {
  /** 最大重试次数 */
  maxRetries?: number;
  /** 重试延迟 (ms) */
  retryDelay?: number;
  /** 中止控制器信号 */
  signal?: AbortSignal;
}

interface StreamResponse {
  message: string;
  conversation_uuid: string;
}

/**
 * 模拟对话流式 API
 * @param onChunk 块回调函数
 * @param options 配置选项
 */
export async function mockChatStreamApi(
  onChunk: (chunk: string) => void,
  options: ChatStreamOptions = {}
): Promise<void> {
  const { maxRetries = 0, retryDelay = 1000, signal } = options;

  // 生成固定会话 ID
  const conversation_uuid = crypto.randomUUID();

  return new Promise((resolve, reject) => {
    // 处理中止信号
    signal?.addEventListener('abort', () => {
      reject(new Error('Request aborted'));
    });

    // 模拟内容分割（按段落分割）
    const chunks = chatContent;
    let currentChunk = 0;
    let attempt = 0;

    const sendChunk = () => {
      if (signal?.aborted) {
        return;
      }

      // 模拟 10% 的失败率
      if (Math.random() < 0.1 && attempt < maxRetries) {
        attempt++;
        setTimeout(sendChunk, retryDelay);
        return;
      }

      if (currentChunk >= chunks.length) {
        // 发送结束标志
        onChunk('data: {"message": "[DONE]"}');
        resolve();
        return;
      }

      // 构建流式响应数据
      const response: StreamResponse = {
        message: chunks[currentChunk],
        conversation_uuid
      };

      // 模拟流式数据格式
      onChunk(`data: ${JSON.stringify(response)}`);

      currentChunk++;
      setTimeout(sendChunk, 300); // 模拟流式间隔
    };

    // 初始延迟模拟网络连接
    setTimeout(sendChunk, 500);
  });
}
const chatContent = [
  `1. 欢迎使用智能助手！以下是今日要点：\n`,
  `**天气预报**：今日晴转多云，气温 22-28℃\n`,
  `2. **新闻摘要**：\n\t`,
  `- 人工智能大会在京召开\n\t`,
  `- 新能源汽车销量创新高\n`,
  `3. **待办提醒**：下午 3 点有团队会议\n`
];
