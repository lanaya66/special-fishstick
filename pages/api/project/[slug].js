import { getLocalProjects, getLocalProjectContent } from '../../../lib/content-sync';

/**
 * API端点：根据slug获取单个项目的详细信息
 * GET /api/project/[slug]?lang=en|zh
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug } = req.query;
    const language = req.query.lang || 'en';

    if (!slug) {
      return res.status(400).json({ error: 'Project slug is required' });
    }

    // 中文注释: 获取所有项目以找到匹配的slug
    const projects = await getLocalProjects(language);
    const project = projects.find(p => p.slug === slug);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // 中文注释: 尝试获取项目的详细内容（如果已同步）
    let detailContent = null;
    try {
      detailContent = await getLocalProjectContent(project.id, language);
    } catch (error) {
      console.log('详细内容暂未同步:', error.message);
    }

    // 中文注释: 返回项目基本信息和详细内容（如果有的话）
    const response = {
      ...project,
      content: detailContent,
      hasDetailContent: !!detailContent
    };

    // 中文注释: 设置缓存控制头，确保内容能及时更新
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json(response);

  } catch (error) {
    console.error('获取项目详情失败:', error);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
} 