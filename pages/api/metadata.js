/**
 * 网页元数据获取 API
 * 获取网页的 Open Graph 数据，包括标题、描述、图片、favicon等
 */
import fetch from 'node-fetch';
import { load } from 'cheerio';

// 中文注释: 固定链接元数据覆盖映射
const FIXED_METADATA_OVERRIDES = {
  'https://www.youtube.com/watch?v=-HhuKL1Q40E': {
    title: 'Introducing Zoom Docs with AI Companion',
    description: 'Supercharge Zoom Workplace collaboration with AI-first docs that transform meeting content into actionable documents, wikis, and projects. Zoom Docs is built with AI Companion at its core and is tightly integrated with Zoom Meetings to optimize team collaboration and boost productivity. Keep information organized and get your work done in one place with AI-first collaborative docs that adapt to different personal and team needs.',
    siteName: 'YouTube',
    favicon: 'https://www.youtube.com/s/desktop/d743c89b/img/favicon_32x32.png'
  },
  'https://www.producthunt.com/products/light-6': {
    title: 'Light',
    description: 'Light is a one-stop solution to collaborate on your team\'s knowledge, projects, and data. We offer Tasks, Projects, Notes, Wiki, Files, Spreadsheets, and Databases. We will tightly integrate personal productivity (to-dos and notes) with team collaboration.',
    siteName: 'Product Hunt',
    favicon: 'https://ph-static.imgix.net/ph-favicon-orange.ico'
  },
  'https://www.linkedin.com/posts/tattooednerd_zoom-docs-is-the-most-powerful-tool-youve-activity-7282500967558746114-1dpZ?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEhQ3aIBxKL8uSfC14NOh9hXRPBwz4qI080': {
    title: 'Zoom Docs is the most powerful tool you\'ve probably never heard of and this is why you should care. | Patrick Kelley',
    description: 'Zoom Docs is the most powerful tool you\'ve probably never heard of and this is why you should care.',
    siteName: 'LinkedIn',
    favicon: 'https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca'
  }
};

// 中文注释: 用户代理轮换列表，模拟不同浏览器
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

// 中文注释: 获取网站favicon的多种方法
const getFavicon = async (hostname, $, baseUrl) => {
  // 中文注释: 1. 尝试从HTML中提取favicon
  const faviconSelectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]', 
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',
    'link[rel="mask-icon"]'
  ];

  for (const selector of faviconSelectors) {
    const href = $(selector).attr('href');
    if (href) {
      // 中文注释: 处理相对路径
      if (href.startsWith('//')) {
        return `https:${href}`;
      } else if (href.startsWith('/')) {
        return `${baseUrl}${href}`;
      } else if (href.startsWith('http')) {
        return href;
      }
    }
  }

  // 中文注释: 2. 使用预定义的高质量favicon映射
  const domainIcons = {
    'zoom.com': 'https://st1.zoom.us/zoom.ico',
    'github.com': 'https://github.githubassets.com/favicons/favicon.svg',
    'linkedin.com': 'https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
    'youtube.com': 'https://www.youtube.com/s/desktop/d743c89b/img/favicon_32x32.png',
    'youtu.be': 'https://www.youtube.com/s/desktop/d743c89b/img/favicon_32x32.png',
    'figma.com': 'https://static.figma.com/app/icon/1/favicon.ico',
    'notion.so': 'https://www.notion.so/images/favicon.ico',
    'medium.com': 'https://cdn-static-1.medium.com/sites/medium.com/favicon.ico',
    'dribbble.com': 'https://cdn.dribbble.com/assets/favicon-62afe6d7ba2eb44d3f7b6b2dbb7e3e63f73e8b66e03a3b7f9c8b52d8b8b2bfa.png',
    'behance.net': 'https://a5.behance.net/54626c9b3b3a1da89af0b29dda1830b1cecc8c5d/img/site/favicon.ico',
    'producthunt.com': 'https://ph-static.imgix.net/ph-favicon-orange.ico',
    'twitter.com': 'https://abs.twimg.com/favicons/twitter.2.ico',
    'x.com': 'https://abs.twimg.com/favicons/twitter.2.ico'
  };
  
  for (const [domain, icon] of Object.entries(domainIcons)) {
    if (hostname.includes(domain)) {
      return icon;
    }
  }

  // 中文注释: 3. 尝试标准的favicon路径
  try {
    const faviconUrl = `${baseUrl}/favicon.ico`;
    const response = await fetch(faviconUrl, { method: 'HEAD', timeout: 3000 });
    if (response.ok) {
      return faviconUrl;
    }
  } catch (error) {
    // 中文注释: 忽略favicon.ico获取失败
  }

  // 中文注释: 4. 最后使用Google的favicon服务
  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
};

// 中文注释: 针对特定网站的特殊处理
const getSpecialSiteData = async (url, hostname) => {
  // 中文注释: YouTube特殊处理
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
    // 中文注释: 尝试从URL提取视频ID
    let videoId = null;
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    
    if (videoId) {
      try {
        // 中文注释: 尝试使用YouTube的oEmbed API获取视频信息
        const oembedResponse = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
          timeout: 5000
        });
        
        if (oembedResponse.ok) {
          const oembedData = await oembedResponse.json();
          return {
            title: oembedData.title || `YouTube视频 - ${videoId}`,
            description: `${oembedData.author_name} 发布的YouTube视频`,
            image: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            siteName: 'YouTube',
            favicon: 'https://www.youtube.com/s/desktop/d743c89b/img/favicon_32x32.png'
          };
        }
      } catch (error) {
        // 中文注释: 如果oEmbed失败，使用备选方案
        console.log('YouTube oEmbed failed, using fallback');
      }
      
      // 中文注释: 备选方案
      return {
        title: `YouTube视频 - ${videoId}`,
        description: '来自YouTube的视频内容',
        image: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        siteName: 'YouTube',
        favicon: 'https://www.youtube.com/s/desktop/d743c89b/img/favicon_32x32.png'
      };
    }
  }

  // 中文注释: LinkedIn特殊处理
  if (hostname.includes('linkedin.com')) {
    // 中文注释: 尝试从URL中提取更多信息
    let title = 'LinkedIn内容';
    let description = '来自LinkedIn的专业内容';
    
    if (url.includes('/posts/')) {
      title = 'LinkedIn帖子';
      description = 'LinkedIn上的专业分享和讨论';
    } else if (url.includes('/pulse/')) {
      title = 'LinkedIn文章';
      description = 'LinkedIn Pulse上的专业文章';
    } else if (url.includes('/company/')) {
      title = 'LinkedIn公司页面';
      description = 'LinkedIn上的公司简介和更新';
    } else if (url.includes('/in/')) {
      title = 'LinkedIn个人资料';
      description = 'LinkedIn上的个人专业档案';
    }
    
    return {
      title: title,
      description: description,
      image: 'https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg',
      siteName: 'LinkedIn',
      favicon: 'https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca'
    };
  }

  return null;
};

// 中文注释: 从域名生成默认标题
const generateFallbackTitle = (hostname) => {
  const siteName = hostname.replace(/^www\./, '').split('.')[0];
  return siteName.charAt(0).toUpperCase() + siteName.slice(1);
};

export default async function handler(req, res) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.query;

  // 验证 URL 参数
  if (!url) {
    return res.status(400).json({ message: 'URL parameter is required' });
  }

  let parsedUrl;
  try {
    // 验证 URL 格式
    parsedUrl = new URL(url);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid URL format' });
  }

  // 中文注释: 设置缓存头，1小时缓存
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  const hostname = parsedUrl.hostname;
  const baseUrl = `${parsedUrl.protocol}//${hostname}`;

  // 中文注释: 准备备用数据
  const fallbackData = {
    title: generateFallbackTitle(hostname),
    description: url,
    image: `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
    siteName: generateFallbackTitle(hostname),
    url: url,
    favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  };

  try {
    // 中文注释: 优先检查固定元数据覆盖
    if (FIXED_METADATA_OVERRIDES[url]) {
      console.log(`Using fixed metadata override for: ${url}`);
      return res.status(200).json({ ...fallbackData, ...FIXED_METADATA_OVERRIDES[url], url: url });
    }

    // 中文注释: 先尝试特殊网站处理
    const specialData = await getSpecialSiteData(url, hostname);
    if (specialData) {
      console.log(`Using special handling for: ${hostname}`);
      return res.status(200).json({ ...fallbackData, ...specialData });
    }

    // 中文注释: 随机选择用户代理，增加更多头部信息
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    
    // 中文注释: 针对不同网站调整超时时间
    const timeout = hostname.includes('youtube.com') || hostname.includes('linkedin.com') ? 15000 : 10000;
    
    // 设置请求头模拟真实浏览器访问
    const headers = {
      'User-Agent': userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      'Pragma': 'no-cache'
    };

    // 中文注释: 为LinkedIn添加特殊头部
    if (hostname.includes('linkedin.com')) {
      headers['Referer'] = 'https://www.google.com/';
      headers['Sec-Ch-Ua'] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
      headers['Sec-Ch-Ua-Mobile'] = '?0';
      headers['Sec-Ch-Ua-Platform'] = '"macOS"';
    }

    const response = await fetch(url, {
      headers,
      timeout,
      follow: 5, // 最多跟随5次重定向
    });

    if (!response.ok) {
      console.log(`HTTP error for ${url}: ${response.status}`);
      // 中文注释: HTTP 错误时返回备用数据而不是报错
      return res.status(200).json(fallbackData);
    }

    const html = await response.text();
    const $ = load(html);

    // 中文注释: 获取favicon
    const favicon = await getFavicon(hostname, $, baseUrl);

    // 中文注释: 尝试获取各种元数据，优先使用 Open Graph
    const metadata = {
      title: $('meta[property="og:title"]').attr('content') ||
             $('meta[name="twitter:title"]').attr('content') ||
             $('title').text().trim() ||
             fallbackData.title,

      description: $('meta[property="og:description"]').attr('content') ||
                  $('meta[name="twitter:description"]').attr('content') ||
                  $('meta[name="description"]').attr('content') ||
                  fallbackData.description,

      image: $('meta[property="og:image"]').attr('content') ||
             $('meta[name="twitter:image"]').attr('content') ||
             $('meta[name="twitter:image:src"]').attr('content') ||
             fallbackData.image,

      siteName: $('meta[property="og:site_name"]').attr('content') ||
               $('meta[name="application-name"]').attr('content') ||
               fallbackData.siteName,

      url: $('meta[property="og:url"]').attr('content') || url,
      
      favicon: favicon
    };

    // 中文注释: 处理相对路径图片
    if (metadata.image && metadata.image.startsWith('/')) {
      metadata.image = `${baseUrl}${metadata.image}`;
    }

    // 中文注释: 验证图片 URL，如果无效则使用备用图标
    if (metadata.image && !metadata.image.startsWith('http')) {
      metadata.image = fallbackData.image;
    }

    // 中文注释: 清理和限制字符串长度
    metadata.title = metadata.title.replace(/\s+/g, ' ').trim().substring(0, 200);
    metadata.description = metadata.description.replace(/\s+/g, ' ').trim().substring(0, 300);

    console.log(`Successfully fetched metadata for: ${url}`);
    return res.status(200).json(metadata);

  } catch (error) {
    console.error('Error fetching metadata:', error);
    
    // 中文注释: 任何错误都返回备用数据，确保用户体验
    return res.status(200).json(fallbackData);
  }
} 