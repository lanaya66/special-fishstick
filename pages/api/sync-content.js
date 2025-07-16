import { syncAllProjects } from '../../lib/content-sync.js';

//-------------- 内容同步API --------------

/**
 * 内容同步API
 * POST /api/sync-content
 * Body: { password: string, language?: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password, language = 'zh' } = req.body;

    // 中文注释: 验证管理员密码
    if (password !== 'uuuuu') {
      return res.status(401).json({ 
        error: '密码错误',
        message: 'Invalid password' 
      });
    }

    console.log(`开始同步${language === 'zh' ? '中文' : '英文'}内容...`);

    // 中文注释: 执行内容同步
    const result = await syncAllProjects(language);

    res.status(200).json({
      success: true,
      message: `${language === 'zh' ? '中文' : '英文'}内容同步完成`,
      ...result
    });

  } catch (error) {
    console.error('内容同步失败:', error);
    res.status(500).json({ 
      error: '内容同步失败',
      message: error.message 
    });
  }
} 