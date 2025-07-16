/**
 * 项目图片映射工具
 * 将项目名称映射到对应的图片文件
 */

//-------------- 项目图片映射表 --------------
const PROJECT_IMAGE_MAP = {
  // 中文注释: Zoom Docs 系列项目
  'Zoom Docs - Contextual AI tools': '/1Zoom Docs - Contextual AI tools.png',
  'Zoom Docs - Ask AI Companion': '/2Zoom Docs - Ask AI Companion1.png', 
  'Zoom Docs - AI meeting doc': '/3Zoom Docs - AI meeting doc.png',
  'Zoom Docs - Page editor': '/4Zoom Docs - Page editor.png',
  
  // 中文注释: Light 系列项目
  'Light - Mainsite': '/5Light - Mainsite.png',
  'Light - GTD': '/6Light - GTD.png',
  
  // 中文注释: 希悦校园项目
  '希悦校园 Chalk 3.0': '/7希悦校园 Chalk.png'
};

//-------------- 项目排序定义 --------------
const PROJECT_ORDER = [
  'Zoom Docs - Contextual AI tools', // 1
  'Zoom Docs - Ask AI Companion', // 2
  'Zoom Docs - AI meeting doc', // 3
  'Zoom Docs - Page editor',  // 4
  'Light - Mainsite',         // 5
  'Light - GTD',              // 6  
  '希悦校园 Chalk 3.0'       // 7
];

/**
 * 获取项目对应的图片路径
 * @param {string} projectName - 项目名称
 * @returns {string} 图片文件路径
 */
export function getProjectImage(projectName) {
  const imagePath = PROJECT_IMAGE_MAP[projectName];
  if (!imagePath) {
    console.warn(`未找到项目 "${projectName}" 的图片映射`);
    return '/background.png'; // 中文注释: 默认背景图片
  }
  return imagePath;
}

/**
 * 按照预定义顺序排序项目列表
 * @param {Array} projects - 项目列表
 * @returns {Array} 排序后的项目列表
 */
export function sortProjectsByOrder(projects) {
  if (!projects || !Array.isArray(projects)) {
    return [];
  }

  // 中文注释: 创建排序索引映射
  const orderMap = {};
  for (let i = 0; i < PROJECT_ORDER.length; i++) {
    orderMap[PROJECT_ORDER[i]] = i;
  }

  // 中文注释: 按照预定义顺序排序
  return projects.sort((a, b) => {
    const orderA = orderMap[a.name];
    const orderB = orderMap[b.name];
    
    // 中文注释: 如果项目在预定义顺序中，使用预定义顺序
    if (orderA !== undefined && orderB !== undefined) {
      return orderA - orderB;
    }
    
    // 中文注释: 如果只有一个项目在预定义顺序中，预定义的排在前面
    if (orderA !== undefined) return -1;
    if (orderB !== undefined) return 1;
    
    // 中文注释: 都不在预定义顺序中，保持原有顺序
    return 0;
  });
}

/**
 * 获取项目在预定义顺序中的位置
 * @param {string} projectName - 项目名称
 * @returns {number} 位置索引，未找到返回-1
 */
export function getProjectOrderIndex(projectName) {
  return PROJECT_ORDER.indexOf(projectName);
} 