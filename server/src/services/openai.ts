import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const generateTags = async (title: string, content: string): Promise<string[]> => {
  try {
    const prompt = `Given the following blog post title and content, generate 3-5 relevant tags that best describe the main topics and themes. Each tag should be a single word or short phrase.

Title: ${title}

Content: ${content}

Tags (comma-separated):`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates relevant tags for blog posts. Generate only the tags, no other text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 50
    });

    const tagsText = response.data.choices[0]?.message?.content || '';
    const tags = tagsText
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    return tags;
  } catch (error) {
    console.error('Error generating tags:', error);
    return [];
  }
};

export const estimateReadTime = (content: string): string => {
  // 移除 HTML 标签
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // 计算字数（英文按空格分词，中文每个字符算一个词）
  const words = plainText.match(/[\u4e00-\u9fa5]|[a-zA-Z]+/g) || [];
  const wordCount = words.length;
  
  // 假设平均阅读速度：中文 300 字/分钟，英文 200 词/分钟
  const minutes = Math.ceil(wordCount / 250); // 取一个平均值
  
  if (minutes < 1) {
    return '不到 1 分钟';
  } else if (minutes === 1) {
    return '1 分钟';
  } else {
    return `${minutes} 分钟`;
  }
};
