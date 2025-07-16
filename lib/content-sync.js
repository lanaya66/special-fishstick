import { getProjects, getProjectContent } from './notion.js';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { getProjectImage } from './project-images.js'; // 中文注释: 引入固定图片映射

//-------------- 内容同步核心逻辑 --------------

/**
 * 同步所有项目数据
 * @param {string} language - 语言版本 ('zh' | 'en')
 * @returns {Promise<Object>} 同步结果
 */
export async function syncAllProjects(language = 'zh') {
  try {
    // 中文注释: 根据语言选择对应的数据库ID
    const databaseId = language === 'zh' 
      ? process.env.NOTION_DATABASE_ID_ZH 
      : process.env.NOTION_DATABASE_ID_EN;

    console.log(`开始同步${language === 'zh' ? '中文' : '英文'}项目数据...`);
    console.log(`使用数据库ID: ${databaseId}`);

    // 中文注释: 获取项目列表
    const projects = await getProjects(databaseId);
    console.log(`获取到 ${projects.length} 个项目`);

    if (projects.length === 0) {
      console.warn('警告: 没有获取到任何项目数据，可能是数据库为空或字段配置有误');
    }

    // 中文注释: 使用预定义的固定图片映射，不下载Notion中的图片
    const projectsWithLocalImages = [];
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      console.log(`处理项目 ${i + 1}/${projects.length}: ${project.name || '无名称'}`);
      
      // 中文注释: 使用预定义的固定图片路径，而不是下载Notion中的图片
      project.localImage = getProjectImage(project.name);
      projectsWithLocalImages.push(project);
    }

    // 中文注释: 保存项目数据到本地JSON文件
    const dataPath = path.join(process.cwd(), 'data', `projects-${language}.json`);
    await fs.ensureDir(path.dirname(dataPath));
    await fs.writeJSON(dataPath, projectsWithLocalImages, { spaces: 2 });

    console.log(`项目数据已保存到: ${dataPath}`);

    return {
      success: true,
      count: projectsWithLocalImages.length,
      language,
      projects: projectsWithLocalImages
    };

  } catch (error) {
    console.error('同步项目数据失败:', error);
    console.error('错误详情:', {
      message: error.message,
      code: error.code,
      status: error.status
    });
    throw error;
  }
}

/**
 * 同步单个项目的详细内容
 * @param {string} projectId - 项目ID
 * @param {string} language - 语言版本
 * @returns {Promise<Object>} 项目详细内容
 */
export async function syncProjectContent(projectId, language = 'zh') {
  try {
    console.log(`开始同步项目内容: ${projectId}, 语言: ${language}`);

    // 中文注释: 根据语言参数找到正确的项目ID
    let targetProjectId = projectId;
    
    // 中文注释: 如果是英文版本，需要从英文数据库中找到对应的项目
    if (language === 'en') {
      const englishProjects = await getLocalProjects('en');
      const chineseProjects = await getLocalProjects('zh');
      
      // 中文注释: 在中文项目列表中找到当前项目（输入的projectId是中文版ID）
      const chineseProject = chineseProjects.find(p => p.id === projectId);
      if (chineseProject) {
        // 中文注释: 根据slug在英文项目列表中找到对应的英文版项目
        const englishProject = englishProjects.find(p => p.slug === chineseProject.slug);
        if (englishProject) {
          targetProjectId = englishProject.id;
          console.log(`找到英文版项目ID: ${targetProjectId} (slug: ${chineseProject.slug})`);
        } else {
          console.warn(`未找到对应的英文版项目，slug: ${chineseProject.slug}`);
          throw new Error(`未找到slug为 ${chineseProject.slug} 的英文版项目`);
        }
      } else {
        console.warn(`未找到ID为 ${projectId} 的中文项目`);
        throw new Error(`未找到ID为 ${projectId} 的中文项目`);
      }
    }

    // 中文注释: 获取项目详细内容
    const content = await getProjectContent(targetProjectId);
    
    // 中文注释: 处理内容中的图片
    const processedBlocks = [];
    for (let i = 0; i < content.blocks.length; i++) {
      const block = content.blocks[i];
      const processedBlock = await processContentBlock(block, projectId);
      processedBlocks.push(processedBlock);
    }

    const projectContent = {
      ...content,
      blocks: processedBlocks,
      synced_at: new Date().toISOString(),
      language: language,
      sourceProjectId: targetProjectId
    };

    // 中文注释: 保存项目内容到本地，英文版本使用英文项目ID作为文件名
    const saveProjectId = language === 'en' ? targetProjectId : projectId;
    const contentPath = path.join(process.cwd(), 'data', 'content', `${saveProjectId}-${language}.json`);
    await fs.ensureDir(path.dirname(contentPath));
    await fs.writeJSON(contentPath, projectContent, { spaces: 2 });

    console.log(`项目内容同步成功，语言: ${language}, 源项目ID: ${targetProjectId}, 保存文件ID: ${saveProjectId}`);
    return projectContent;

  } catch (error) {
    console.error('同步项目内容失败:', error);
    throw error;
  }
}

/**
 * 下载项目图片到本地 (已废弃 - 现在使用预定义固定图片)
 * 注释: 保留此函数以防未来需要，但项目封面图片现在使用预定义的固定映射
 */
// async function downloadProjectImage(imageUrl, projectSlug) {
//   // 中文注释: 此函数已废弃，项目封面图片现在使用预定义的固定映射
//   console.log('警告: downloadProjectImage函数已废弃，请使用getProjectImage获取预定义图片');
//   return null;
// }

/**
 * 递归处理Notion内容块，包括子块
 * @param {Object} block - Notion内容块
 * @param {string} projectId - 项目ID
 * @returns {Promise<Object>} 处理后的内容块
 */
async function processContentBlock(block, projectId) {
  try {
    // 中文注释: 处理图片块，下载图片到本地
    if (block.type === 'image') {
      const imageUrl = block.image.type === 'file' 
        ? block.image.file.url 
        : block.image.external.url;

      if (imageUrl) {
        const localImagePath = await downloadContentImage(imageUrl, projectId, block.id);
        if (localImagePath) {
          // 中文注释: 更新块中的图片URL为本地路径
          block.image.localPath = localImagePath;
        }
      }
    }

    // 中文注释: 处理文件块，下载文件到本地
    if (block.type === 'file') {
      const fileUrl = block.file.type === 'file' 
        ? block.file.file.url 
        : block.file.external.url;

      if (fileUrl) {
        const fileName = block.file.name || 'unnamed-file';
        const localFilePath = await downloadContentFile(fileUrl, projectId, block.id, fileName);
        if (localFilePath) {
          // 中文注释: 更新块中的文件URL为本地路径
          block.file.localPath = localFilePath;
        }
      }
    }

    // 中文注释: 处理PDF块，下载PDF到本地
    if (block.type === 'pdf') {
      const pdfUrl = block.pdf.type === 'file' 
        ? block.pdf.file.url 
        : block.pdf.external.url;

      if (pdfUrl) {
        // 中文注释: PDF块通常没有name属性，从URL中推断文件名
        const urlPath = new URL(pdfUrl).pathname;
        const fileName = decodeURIComponent(urlPath.split('/').pop()) || 'document.pdf';
        const localFilePath = await downloadContentFile(pdfUrl, projectId, block.id, fileName);
        if (localFilePath) {
          // 中文注释: 更新块中的PDF URL为本地路径
          block.pdf.localPath = localFilePath;
        }
      }
    }

    // 中文注释: 处理视频块，下载视频到本地
    if (block.type === 'video') {
      const videoUrl = block.video.type === 'file' 
        ? block.video.file.url 
        : block.video.external.url;

      if (videoUrl) {
        // 中文注释: 视频块通常没有name属性，从URL中推断文件名
        const urlPath = new URL(videoUrl.split('?')[0]).pathname;
        const fileName = decodeURIComponent(urlPath.split('/').pop()) || 'video.mp4';
        const localFilePath = await downloadContentVideo(videoUrl, projectId, block.id, fileName);
        if (localFilePath) {
          // 中文注释: 更新块中的视频URL为本地路径
          block.video.localPath = localFilePath;
        }
      }
    }

    // 中文注释: 递归处理子块（如果存在）
    if (block.children && Array.isArray(block.children)) {
      const processedChildren = [];
      for (const child of block.children) {
        const processedChild = await processContentBlock(child, projectId);
        processedChildren.push(processedChild);
      }
      block.children = processedChildren;
    }

    return block;
  } catch (error) {
    console.error('处理内容块失败:', error);
    return block;
  }
}

/**
 * 下载内容中的图片
 * @param {string} imageUrl - 图片URL  
 * @param {string} projectId - 项目ID
 * @param {string} blockId - 块ID
 * @returns {Promise<string>} 本地图片路径
 */
async function downloadContentImage(imageUrl, projectId, blockId) {
  try {
    const urlParts = imageUrl.split('?')[0];
    const extension = path.extname(urlParts) || '.jpg';
    
    const fileName = `${projectId}-${blockId}${extension}`;
    const localPath = path.join('projects', 'content', fileName);
    const fullPath = path.join(process.cwd(), 'public', localPath);

    await fs.ensureDir(path.dirname(fullPath));

    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream',
      timeout: 30000
    });

    const writer = fs.createWriteStream(fullPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`内容图片已下载: ${localPath}`);
        resolve(`/${localPath}`);
      });
      writer.on('error', reject);
    });

  } catch (error) {
    console.error('下载内容图片失败:', error);
    return null;
  }
}

/**
 * 下载内容中的文件
 * @param {string} fileUrl - 文件URL  
 * @param {string} projectId - 项目ID
 * @param {string} blockId - 块ID
 * @param {string} fileName - 文件名
 * @returns {Promise<string>} 本地文件路径
 */
async function downloadContentFile(fileUrl, projectId, blockId, fileName) {
  try {
    // 中文注释: 确保文件名有正确的扩展名
    let extension = path.extname(fileName);
    if (!extension) {
      // 中文注释: 如果没有扩展名，尝试从URL中获取
      const urlParts = fileUrl.split('?')[0];
      extension = path.extname(urlParts) || '.bin';
    }
    
    // 中文注释: 清理文件名，移除非法字符
    const cleanFileName = fileName.replace(/[<>:"/\\|?*]/g, '-');
    const finalFileName = `${projectId}-${blockId}-${cleanFileName}`;
    
    const localPath = path.join('projects', 'files', finalFileName);
    const fullPath = path.join(process.cwd(), 'public', localPath);

    // 中文注释: 确保目录存在
    await fs.ensureDir(path.dirname(fullPath));

    console.log(`开始下载文件: ${fileName} (${finalFileName})`);

    // 中文注释: 下载文件
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream',
      timeout: 60000,  // 文件可能比图片大，增加超时时间
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const writer = fs.createWriteStream(fullPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`内容文件已下载: ${localPath}`);
        resolve(`/${localPath}`);
      });
      writer.on('error', (error) => {
        console.error(`文件下载失败: ${error.message}`);
        reject(error);
      });
    });

  } catch (error) {
    console.error('下载内容文件失败:', error);
    return null;
  }
}

/**
 * 下载内容中的视频
 * @param {string} videoUrl - 视频URL  
 * @param {string} projectId - 项目ID
 * @param {string} blockId - 块ID
 * @param {string} fileName - 文件名
 * @returns {Promise<string>} 本地视频路径
 */
async function downloadContentVideo(videoUrl, projectId, blockId, fileName) {
  try {
    // 中文注释: 确保文件名有正确的视频扩展名
    let extension = path.extname(fileName);
    if (!extension || !['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(extension.toLowerCase())) {
      // 中文注释: 如果没有视频扩展名，尝试从URL中获取或默认为mp4
      const urlParts = videoUrl.split('?')[0];
      extension = path.extname(urlParts) || '.mp4';
    }
    
    // 中文注释: 清理文件名，移除非法字符
    const cleanFileName = fileName.replace(/[<>:"/\\|?*]/g, '-');
    const finalFileName = `${projectId}-${blockId}-${cleanFileName}`;
    
    const localPath = path.join('projects', 'videos', finalFileName);
    const fullPath = path.join(process.cwd(), 'public', localPath);

    // 中文注释: 确保目录存在
    await fs.ensureDir(path.dirname(fullPath));

    console.log(`开始下载视频: ${fileName} (${finalFileName})`);

    // 中文注释: 下载视频文件
    const response = await axios({
      url: videoUrl,
      method: 'GET',
      responseType: 'stream',
      timeout: 180000,  // 视频文件通常较大，增加超时时间到3分钟
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const writer = fs.createWriteStream(fullPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`内容视频已下载: ${localPath}`);
        resolve(`/${localPath}`);
      });
      writer.on('error', (error) => {
        console.error(`视频下载失败: ${error.message}`);
        reject(error);
      });
    });

  } catch (error) {
    console.error('下载内容视频失败:', error);
    return null;
  }
}

/**
 * 从项目内容中提取时间范围
 * @param {string} projectId - 项目ID
 * @param {string} language - 语言版本
 * @returns {string|null} 时间范围字符串或null
 */
export async function extractTimeRangeFromContent(projectId, language) {
  try {
    const content = await getLocalProjectContent(projectId, language);
    if (!content || !content.blocks || content.blocks.length === 0) {
      return null;
    }

    // 中文注释: 查找包含时间信息的段落
    for (const block of content.blocks) {
      if (block.type === 'paragraph' && block.paragraph && block.paragraph.rich_text) {
        const textContent = block.paragraph.rich_text
          .map(item => item.plain_text || '')
          .join('');
        
        // 中文注释: 匹配时间格式 "🕰️ 时间: YYYY.MM - YYYY.MM" 或 "🕰️ Duration: YYYY.MM - YYYY.MM"
        const timeMatch = textContent.match(/🕰️\s*(?:时间|Duration):\s*(.+)/);
        if (timeMatch) {
          return timeMatch[1].trim(); // 返回时间范围部分
        }
      }
    }
    
    return null;
  } catch (error) {
    console.log(`提取项目 ${projectId} 时间范围失败:`, error.message);
    return null;
  }
}

/**
 * 从本地JSON文件读取项目数据，并添加时间范围信息
 * @param {string} language - 语言版本 ('zh' | 'en')
 * @returns {Promise<Array>} 项目列表（包含时间范围）
 */
export async function getLocalProjects(language = 'zh') {
  try {
    const dataPath = path.join(process.cwd(), 'data', `projects-${language}.json`);
    
    if (!(await fs.pathExists(dataPath))) {
      console.warn(`项目数据文件不存在: ${dataPath}`);
      return [];
    }

    const projects = await fs.readJSON(dataPath);
    
    // 中文注释: 为每个项目添加时间范围信息
    const projectsWithTimeRange = [];
    for (const project of projects) {
      const timeRange = await extractTimeRangeFromContent(project.id, language);
      projectsWithTimeRange.push({
        ...project,
        timeRange: timeRange || project.year?.toString() || '2025' // 备用显示年份
      });
    }
    
    return projectsWithTimeRange;
  } catch (error) {
    console.error('读取项目数据失败:', error);
    return [];
  }
}

/**
 * 获取本地项目内容
 * @param {string} projectId - 项目ID
 * @param {string} language - 语言版本
 * @returns {Promise<Object>} 项目内容
 */
export async function getLocalProjectContent(projectId, language = 'zh') {
  try {
    const contentPath = path.join(process.cwd(), 'data', 'content', `${projectId}-${language}.json`);
    
    if (await fs.pathExists(contentPath)) {
      return await fs.readJSON(contentPath);
    }
    
    return null;
  } catch (error) {
    console.error('读取本地项目内容失败:', error);
    return null;
  }
} 