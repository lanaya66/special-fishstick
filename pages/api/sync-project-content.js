import { syncProjectContent } from '../../lib/content-sync';

/**
 * API端点：同步单个项目的详细内容
 * POST /api/sync-project-content
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectId, language, password } = req.body;

    // 中文注释: 验证管理员密码
    if (password !== 'uuuuu') {
      return res.status(401).json({ error: '密码错误' });
    }

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    console.log(`开始同步项目内容: ${projectId}, 语言: ${language || 'zh'}`);

    // 中文注释: 同步项目详细内容
    const result = await syncProjectContent(projectId, language || 'zh');

    console.log('项目内容同步成功');

    res.status(200).json({
      success: true,
      message: '项目内容同步成功',
      projectId,
      language: language || 'zh',
      syncedAt: result.synced_at
    });

  } catch (error) {
    console.error('同步项目内容失败:', error);
    res.status(500).json({ 
      error: '同步失败', 
      details: error.message 
    });
  }
} 