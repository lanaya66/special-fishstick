import { Client } from '@notionhq/client';

//-------------- Notion 客户端初始化 --------------
const notion = new Client({
  auth: process.env.NOTION_SECRET,
  timeoutMs: 60000, // 中文注释: 设置60秒超时时间
});

/**
 * 获取数据库中的所有项目
 * @param {string} databaseId - Notion数据库ID
 * @returns {Promise<Array>} 项目列表
 */
export async function getProjects(databaseId) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      // 中文注释: 暂时移除排序，使用Notion默认顺序
      // sorts: [
      //   {
      //     property: 'Created time',
      //     direction: 'ascending'
      //   }
      // ]
    });

    // 中文注释: 转换Notion数据格式为我们需要的格式
    const projects = [];
    for (let i = 0; i < response.results.length; i++) {
      const page = response.results[i];
      const project = await transformNotionPage(page);
      if (project) {
        projects.push(project);
      }
    }

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

/**
 * 获取单个项目的详细内容 - 带重试机制
 * @param {string} pageId - Notion页面ID
 * @param {number} maxRetries - 最大重试次数
 * @returns {Promise<Object>} 项目详细信息
 */
export async function getProjectContent(pageId, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
  try {
      console.log(`尝试获取项目内容 (第 ${attempt}/${maxRetries} 次): ${pageId}`);
      
    // 中文注释: 获取页面基本信息
    const page = await notion.pages.retrieve({ page_id: pageId });
    
    // 中文注释: 获取页面内容块，处理分页
    let allBlocks = [];
    let cursor = undefined;
    let hasMore = true;
    let pageNum = 1;

    while (hasMore) {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100, // 每次最多获取100个块
      });

      allBlocks = allBlocks.concat(response.results);
      
      // 检查是否还有更多内容
      hasMore = response.has_more;
      cursor = response.next_cursor;
      pageNum++;

      // 防止无限循环的安全措施
      if (pageNum > 50) {
        console.warn('达到最大页数限制，停止获取');
        break;
      }
    }

    // 中文注释: 递归获取子块的内容（如果有嵌套块）
    const processedBlocks = [];
    for (const block of allBlocks) {
      const processedBlock = await processBlockRecursively(block);
      processedBlocks.push(processedBlock);
    }

    return {
      page,
      blocks: processedBlocks
    };
  } catch (error) {
      console.error(`获取项目内容失败 (第 ${attempt}/${maxRetries} 次):`, error.message);
      
      // 中文注释: 如果是最后一次重试，抛出错误
      if (attempt === maxRetries) {
    throw error;
      }
      
      // 中文注释: 等待后重试，每次等待时间递增
      const waitTime = attempt * 2000; // 2秒、4秒、6秒...
      console.log(`等待 ${waitTime}ms 后重试...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

/**
 * 递归处理块，获取子块内容
 * @param {Object} block - Notion块对象
 * @returns {Promise<Object>} 处理后的块对象
 */
async function processBlockRecursively(block) {
  const processedBlock = { ...block };

  // 检查块是否有子块
  if (block.has_children) {
    try {
      let allChildren = [];
      let cursor = undefined;
      let hasMore = true;
      let pageNum = 1;

      while (hasMore) {
        const childrenResponse = await notion.blocks.children.list({
          block_id: block.id,
          start_cursor: cursor,
          page_size: 100,
        });

        allChildren = allChildren.concat(childrenResponse.results);
        
        hasMore = childrenResponse.has_more;
        cursor = childrenResponse.next_cursor;
        pageNum++;

        // 防止无限循环
        if (pageNum > 20) {
          console.warn(`子块获取达到最大页数限制: ${block.id}`);
          break;
        }
      }

      // 子块获取完成

      // 递归处理子块
      const processedChildren = [];
      for (const child of allChildren) {
        const processedChild = await processBlockRecursively(child);
        processedChildren.push(processedChild);
      }

      processedBlock.children = processedChildren;
    } catch (error) {
      console.error(`Error fetching children for block ${block.id}:`, error);
      processedBlock.children = [];
    }
  }

  return processedBlock;
}

/**
 * 转换Notion页面数据为项目格式
 * @param {Object} page - Notion页面对象
 * @returns {Object} 转换后的项目对象
 */
async function transformNotionPage(page) {
  try {
    const properties = page.properties;
    
    // 中文注释: 提取项目基本信息
    const name = properties.Name?.title?.[0]?.text?.content || '';
    const tags = properties.Tag?.multi_select?.map(tag => tag.name) || [];
    const year = properties.Year?.number || new Date().getFullYear();
    
    // 中文注释: 处理项目图片
    let image = null;
    if (properties.Image?.files?.[0]) {
      const imageFile = properties.Image.files[0];
      image = imageFile.type === 'file' ? imageFile.file.url : imageFile.external.url;
    }

    // 中文注释: 生成URL slug（用name字段）
    const slug = generateSlug(name);

    return {
      id: page.id,
      name,
      tags,
      year,
      image,
      slug,
      created: page.created_time,
      updated: page.last_edited_time
    };
  } catch (error) {
    console.error('Error transforming page:', error);
    return null;
  }
}

/**
 * 生成URL友好的slug
 * @param {string} name - 项目名称
 * @returns {string} URL slug
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 中文注释: 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 中文注释: 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 中文注释: 移除首尾连字符
}

export { notion }; 