import { getLocalProjects } from '../../lib/content-sync.js';

//-------------- 项目列表API --------------

/**
 * 获取项目列表API
 * GET /api/projects?lang=zh|en
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 中文注释: 获取语言参数，默认为中文
    const language = req.query.lang || 'zh';
    
    // 中文注释: 从本地文件读取项目数据
    const projects = await getLocalProjects(language);
    
    res.status(200).json({
      success: true,
      projects,
      count: projects.length,
      language
    });

  } catch (error) {
    console.error('获取项目列表失败:', error);
    res.status(500).json({ 
      error: '获取项目列表失败',
      message: error.message 
    });
  }
} 