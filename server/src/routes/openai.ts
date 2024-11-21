import { Router } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 增强文章内容
router.post('/enhance', async (req, res) => {
    try {
        const { content, instruction } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "你是一位专业的技术文章作者和编辑。你的任务是增强、扩展或改进给定的文本，同时保持其原有的含义和风格。请用中文回复。"
                },
                {
                    role: "user",
                    content: `请${instruction || '增强和扩展'}以下内容：\n\n${content}`
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        if (!completion.choices[0]?.message?.content) {
            throw new Error('Failed to get valid response from OpenAI');
        }

        res.json({ 
            success: true, 
            enhancedContent: completion.choices[0].message.content 
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: '内容增强失败' 
        });
    }
});

// 生成标题建议
router.post('/suggest-titles', async (req, res) => {
    try {
        const { content } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "你是一位专业的技术博客标题撰写者。请为给定的内容生成5个吸引人的、对搜索引擎友好的中文标题。注重清晰度、可搜索性和对读者的吸引力。"
                },
                {
                    role: "user",
                    content: `请为这篇文章生成5个不同的中文标题建议：\n\n${content}`
                }
            ],
            temperature: 0.8,
            max_tokens: 500,
        });

        if (!completion.choices[0]?.message?.content) {
            throw new Error('Failed to get valid response from OpenAI');
        }

        const titles = completion.choices[0].message.content
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^\d+\.\s*/, ''));

        res.json({ 
            success: true, 
            titles
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: '标题生成失败' 
        });
    }
});

// 生成标签建议
router.post('/suggest-tags', async (req, res) => {
    try {
        const { content } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "你是一位技术内容标签生成专家。请为给定的内容生成相关的中文标签。关注技术主题、框架、语言和概念。请只返回用逗号分隔的标签列表。"
                },
                {
                    role: "user",
                    content: `请为这篇内容生成相关的中文标签：\n\n${content}`
                }
            ],
            temperature: 0.6,
            max_tokens: 200,
        });

        if (!completion.choices[0]?.message?.content) {
            throw new Error('Failed to get valid response from OpenAI');
        }

        const tags = completion.choices[0].message.content
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);

        res.json({ 
            success: true, 
            tags
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: '标签生成失败' 
        });
    }
});

// 生成摘要
router.post('/generate-excerpt', async (req, res) => {
    try {
        const { content } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "你是一位内容摘要专家。请创建一个引人入胜、简洁的中文摘要（最多150字），需要概括主要观点并鼓励读者阅读更多。"
                },
                {
                    role: "user",
                    content: `请为这篇文章生成一个吸引人的中文摘要：\n\n${content}`
                }
            ],
            temperature: 0.7,
            max_tokens: 200,
        });

        if (!completion.choices[0]?.message?.content) {
            throw new Error('Failed to get valid response from OpenAI');
        }

        res.json({ 
            success: true, 
            excerpt: completion.choices[0].message.content
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: '摘要生成失败' 
        });
    }
});

export default router;
