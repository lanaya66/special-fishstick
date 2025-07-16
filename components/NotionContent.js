import { useState, useEffect } from 'react';
import ImageViewer from './ImageViewer';


/**
 * Notion内容渲染组件
 * @param {Array} blocks - Notion内容块数组
 * @returns {JSX.Element} 渲染的内容
 */
export default function NotionContent({ blocks }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // 中文注释: 预处理 blocks，确保数据完整性，保留空段落用于空行显示
  const preprocessBlocks = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) {
      return [];
    }

    const filtered = blocks.filter(block => {
      // 保留所有有效的块，包括空段落（用于显示空行）
      return block && block.type && block.id;
    });



    return filtered;
  };

  const processedBlocks = preprocessBlocks(blocks);

  //-------------- 通用富文本渲染函数 --------------

  const renderRichText = (richText) => {
    if (!richText || richText.length === 0) {
      return '';
    }

    return richText.map((text, index) => {
      const { plain_text, annotations, href } = text;
      let className = '';
      let style = {};

      // 处理文本样式
      if (annotations.bold) {
        className += ' font-semibold';
        style.fontWeight = '600';
      }
      if (annotations.italic) {
        className += ' italic';
        style.fontStyle = 'italic';
      }
      if (annotations.strikethrough) {
        className += ' line-through';
        style.textDecoration = 'line-through';
      }
      if (annotations.underline) {
        className += ' underline';
        style.textDecoration = style.textDecoration ? `${style.textDecoration} underline` : 'underline';
      }
      if (annotations.code) {
        return (
          <code 
            key={index} 
            className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-[14px] border border-gray-200"
            style={{ 
              fontFamily: "'JetBrains Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace",
              fontWeight: '400'
            }}
          >
            {plain_text}
          </code>
        );
      }

      // 处理链接
      if (href) {
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-inherit hover:opacity-80 underline decoration-1 ${className}`}
            style={style}
          >
            {plain_text}
          </a>
        );
      }

      // 处理颜色
      if (annotations.color && annotations.color !== 'default') {
        const colorMap = {
          gray: 'text-gray-500',
          brown: 'text-amber-700',
          orange: 'text-orange-600',
          yellow: 'text-yellow-600',
          green: 'text-green-600',
          blue: 'text-blue-600',
          purple: 'text-purple-600',
          pink: 'text-pink-600',
          red: 'text-red-600',
        };
        className += ` ${colorMap[annotations.color] || ''}`;
      }

      return (
        <span 
          key={index} 
          className={className} 
          style={{
            ...style,
            whiteSpace: 'pre-wrap', // 保留空格和换行
            wordBreak: 'break-word' // 防止长文本溢出
          }}
        >
          {plain_text}
        </span>
      );
    });
  };

  //-------------- 网页元数据相关函数 --------------
  
  /**
   * BookmarkCard 组件 - 支持动态加载网页元数据和真实favicon
   */
  const BookmarkCard = ({ url, caption }) => {
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [faviconError, setFaviconError] = useState(false);

    useEffect(() => {
      const fetchMetadata = async () => {
        try {
          const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
          if (response.ok) {
            const data = await response.json();
            setMetadata(data);
          } else {
            throw new Error('Failed to fetch metadata');
          }
        } catch (error) {
          console.error('Error fetching metadata:', error);
          setError(true);
          // 设置默认元数据
          const domain = new URL(url).hostname.replace('www.', '');
          setMetadata({
            title: caption && caption.length > 0 ? caption.map(c => c.plain_text).join('') : domain,
            description: url,
            image: null,
            siteName: domain,
            url: url,
            favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
          });
        } finally {
          setLoading(false);
        }
      };

      fetchMetadata();
    }, [url, caption]);

    // 中文注释: 获取网站emoji图标作为favicon加载失败时的备选
    const getWebsiteEmojiIcon = (hostname) => {
      if (hostname.includes('youtube')) return '📺';
      if (hostname.includes('github')) return '🐙';
      if (hostname.includes('figma')) return '🎨';
      if (hostname.includes('notion')) return '📝';
      if (hostname.includes('twitter') || hostname.includes('x.com')) return '🐦';
      if (hostname.includes('linkedin')) return '💼';
      if (hostname.includes('medium')) return '📖';
      if (hostname.includes('stackoverflow')) return '💻';
      if (hostname.includes('dribbble')) return '🏀';
      if (hostname.includes('behance')) return '🎭';
      if (hostname.includes('zoom')) return '🎥';
      if (hostname.includes('producthunt')) return '🚀';
      return '🌐';
    };

    // 中文注释: 处理favicon加载失败
    const handleFaviconError = () => {
      setFaviconError(true);
    };

    const domain = new URL(url).hostname.replace('www.', '');

    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block my-4 no-underline transition-shadow duration-200"
        style={{
          "&:hover": {
            boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.04), 0px 2px 6px 0px rgba(0, 0, 0, 0.04)"
          }
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0px 4px 16px 0px rgba(0, 0, 0, 0.04), 0px 2px 6px 0px rgba(0, 0, 0, 0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* 中文注释: 使用CSS Grid实现响应式布局 */}
          <div className="bookmark-container bg-white hover:bg-gray-50 rounded-lg">
            {/* 中文注释: 左侧内容区域 */}
            <div 
              className="p-4 min-w-0 overflow-hidden"
              style={{
                display: 'flex',
                flexDirection: 'column', 
                justifyContent: 'space-between',
                height: '120px'
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <div 
                  className="text-gray-900 font-medium text-[14px] mb-1 line-clamp-1"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
                  ) : (
                    metadata?.title || domain
                  )}
                </div>
                <div 
                  className="text-gray-500 text-[12px] line-clamp-2"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-3 rounded w-full mt-1"></div>
                  ) : (
                    metadata?.description || (url.length > 80 ? `${url.substring(0, 80)}...` : url)
                  )}
                </div>
              </div>
              <div 
                className="flex items-center text-gray-500 text-xs"
                style={{
                  marginTop: '8px',
                  flexShrink: 0
                }}
              >
                {loading ? (
                  <div className="w-3 h-3 bg-gray-200 rounded-sm mr-2 animate-pulse flex-shrink-0"></div>
                ) : (
                  !faviconError && metadata?.favicon ? (
                    <img 
                      src={metadata.favicon}
                      alt={`${metadata.siteName || domain} favicon`}
                      className="w-3 h-3 mr-2 flex-shrink-0 object-contain"
                      onError={handleFaviconError}
                    />
                  ) : (
                    <span className="mr-2 text-xs flex-shrink-0">{getWebsiteEmojiIcon(domain)}</span>
                  )
                )}
                <span className="truncate text-gray-400 text-xs">
                  {url}
                </span>
              </div>
            </div>
            
            {/* 中文注释: 右侧缩略图区域 - 240*120 */}
            <div className="thumbnail-area bg-gray-50 flex items-center justify-center border-l border-gray-100 rounded-r-lg">
              {loading ? (
                <div className="animate-pulse bg-gray-200 w-16 h-16 rounded"></div>
              ) : metadata?.image ? (
                // 中文注释: 判断是否是favicon类型的小图标
                metadata.image.includes('favicon') || 
                metadata.image.includes('google.com/s2/favicons') ||
                metadata.image.includes('icon') ? (
                  <img 
                    src={metadata.image} 
                    alt={metadata.title}
                    style={{
                      width: '32px',
                      height: '32px',
                      objectFit: 'contain',
                      maxWidth: '32px',
                      maxHeight: '32px',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                <img 
                  src={metadata.image} 
                  alt={metadata.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                )
              ) : null}
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ display: metadata?.image ? 'none' : 'flex' }}
              >
                {!faviconError && metadata?.favicon ? (
                  <img 
                    src={metadata.favicon}
                    alt={`${metadata.siteName || domain} favicon`}
                    style={{
                      width: '32px',
                      height: '32px', 
                      objectFit: 'contain',
                      maxWidth: '32px',
                      maxHeight: '32px',
                      display: 'block'
                    }}
                    onError={handleFaviconError}
                  />
                ) : (
                  <span style={{
                    fontSize: '20px',
                    color: '#D1D5DB',
                    display: 'block',
                    lineHeight: '1'
                  }}>{getWebsiteEmojiIcon(domain)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 中文注释: 响应式样式通过CSS类实现 */}
        <style jsx>{`
          .bookmark-container {
            display: grid;
            grid-template-columns: minmax(240px, 1fr) 240px;
            height: 120px;
          }
        `}</style>
        
        <style jsx>{`
          @media (max-width: 640px) {
            .bookmark-container {
              grid-template-columns: 1fr !important;
            }
            .thumbnail-area {
              display: none !important;
            }
          }
        `}</style>
      </a>
    );
  };

  //-------------- 文件相关函数 --------------

  /**
   * 获取文件类型图标
   */
  const getFileIcon = (fileName, url) => {
    if (!fileName && url) {
      // 从 URL 推断文件类型
      const urlLower = url.toLowerCase();
      if (urlLower.includes('.pdf')) return '📄';
      if (urlLower.includes('.doc') || urlLower.includes('.docx')) return '📝';
      if (urlLower.includes('.xls') || urlLower.includes('.xlsx')) return '📊';
      if (urlLower.includes('.ppt') || urlLower.includes('.pptx')) return '📽️';
      if (urlLower.includes('.zip') || urlLower.includes('.rar')) return '🗜️';
      if (urlLower.includes('.jpg') || urlLower.includes('.png') || urlLower.includes('.gif')) return '🖼️';
      return '📎';
    }

    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📽️';
      case 'zip':
      case 'rar':
      case '7z': return '🗜️';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp': return '🖼️';
      case 'mp4':
      case 'avi':
      case 'mov': return '🎬';
      case 'mp3':
      case 'wav':
      case 'flac': return '🎵';
      case 'txt': return '📄';
      default: return '📎';
    }
  };

  /**
   * 格式化文件大小（如果可用）
   */
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  /**
   * FileCard 组件 - 文件卡片 (简化版)
   * 总是使用本地文件路径
   */
  const FileCard = ({ file, caption }) => {
    const displayName = file.name || 'Download File';
    const fileIcon = getFileIcon(displayName, file.file?.url); // a fallback just in case
    const fileUrl = file.localPath; // Always use localPath

    if (!fileUrl) {
      return (
        <div className="my-4">
          <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 text-center text-gray-500 text-[12px]">
            文件正在处理中，请稍后刷新页面或联系管理员重新同步内容。
          </div>
        </div>
      );
    }
    
    return (
      <div className="my-4">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 no-underline"
        >
          <div className="text-3xl mr-4">{fileIcon}</div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-gray-900 font-medium text-[14px] truncate">
              {displayName}
            </div>
            {caption && caption.length > 0 && (
              <div className="text-gray-500 text-[12px] mt-1">
                {renderRichText(caption)}
              </div>
            )}
            <div className="text-[12px] mt-1 font-medium" style={{ color: 'rgba(50, 51, 53, 0.56)' }}>
              点击打开文件
            </div>
          </div>
        </a>
      </div>
    );
  };

  /**
   * PDFCard 组件 - PDF 预览卡片 (简化版)
   * 总是使用本地文件路径
   */
  const PDFCard = ({ file, caption }) => {
    const fileName = file.name || 'Document.pdf';
    const fileUrl = file.localPath; // Always use localPath

    if (!fileUrl) {
      return (
        <div className="my-4">
          <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 text-center text-gray-500 text-[12px]">
            PDF文件正在处理中，请稍后刷新页面或联系管理员重新同步内容。
          </div>
        </div>
      );
    }

    return (
      <div className="my-4">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 no-underline"
        >
          <div className="text-3xl mr-4">📄</div>
          <div className="flex-1 min-w-0">
            <div className="text-gray-900 font-medium text-[14px] truncate">
              {fileName}
            </div>
            {caption && caption.length > 0 && (
              <div className="text-gray-500 text-[12px] mt-1">
                {renderRichText(caption)}
              </div>
            )}
            <div className="text-[12px] mt-1 font-medium" style={{ color: 'rgba(50, 51, 53, 0.56)' }}>
              点击打开文件
            </div>
          </div>
        </a>
      </div>
    );
  };

  const renderBlock = (block, index = 0, listContext = null, nestLevel = 0) => {
    const { type, id } = block;

    // 处理不同层级的缩进
    const getIndentStyle = (level) => {
      return level > 0 ? { marginLeft: `${level * 28}px` } : {};
    };

    switch (type) {
      case 'paragraph':
        if (!block.paragraph.rich_text || block.paragraph.rich_text.length === 0) {
          // 中文注释: 空行显示为正文行高的空白，与Notion保持一致
          return (
            <div 
              key={id} 
              className="mb-3"
              style={{ 
                height: '26px', // 更新为26px行高
                minHeight: '26px',
                ...getIndentStyle(nestLevel)
              }}
            >
              {/* 空行，占据正文一行的高度 */}
            </div>
          );
        }
        return (
          <p 
            key={id} 
            className="mb-3 text-gray-800 text-[16px]"
            style={{ 
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: '400',
              lineHeight: '26px', // 更新行高为26px
              ...getIndentStyle(nestLevel)
            }}
          >
            {renderRichText(block.paragraph.rich_text)}
          </p>
        );

      case 'heading_1':
        return (
          <h1 
            key={id} 
            className="notion-heading-1 text-[28px] font-semibold text-gray-900 mt-8 mb-6"
            style={{ 
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: '600',
              ...getIndentStyle(nestLevel)
            }}
          >
            {renderRichText(block.heading_1.rich_text)}
          </h1>
        );

      case 'heading_2':
        return (
          <h2 
            key={id} 
            className="text-[22px] font-semibold text-gray-900 mt-6 mb-4"
            style={{ 
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: '600',
              ...getIndentStyle(nestLevel)
            }}
          >
            {renderRichText(block.heading_2.rich_text)}
          </h2>
        );

      case 'heading_3':
        return (
          <h3 
            key={id} 
            className="text-[18px] font-semibold text-gray-900 mt-4 mb-3"
            style={{ 
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: '600',
              ...getIndentStyle(nestLevel)
            }}
          >
            {renderRichText(block.heading_3.rich_text)}
          </h3>
        );

      case 'bulleted_list_item':
        // 中文注释: 动态计算层级样式
        const getBulletStyle = (level) => {
          const styles = [
            { content: '•', color: '#323335' }, // 第一级：实心圆点
            { content: '◦', color: '#323335' }, // 第二级：空心圆圈
            { content: '▪', color: '#323335' }, // 第三级：小方块
          ];
          return styles[level % styles.length];
        };

        const currentBulletStyle = getBulletStyle(nestLevel);

        return (
          <div key={id} style={nestLevel === 0 ? {} : getIndentStyle(nestLevel)} className="my-2">
            <div className="flex items-start">
              <div 
                className="flex items-center justify-center"
              style={{ 
                  width: '28px',
                height: '24px',
                  position: 'relative',
                  alignItems: 'center',
                justifyContent: 'center',
                  display: 'flex'
                }}
              >
                <span 
                  style={{ 
                    color: currentBulletStyle.color,
                    fontSize: '6px',
                    lineHeight: '1',
                    display: 'block',
                    width: '6px',
                    height: '6px',
                    borderRadius: currentBulletStyle.content === '•' ? '50%' : '0',
                    border: currentBulletStyle.content === '◦' ? '1px solid #323335' : 'none',
                    backgroundColor: currentBulletStyle.content === '•' ? '#323335' : 
                                   currentBulletStyle.content === '▪' ? '#323335' : 'transparent',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div 
                  className="text-gray-800 text-[16px] leading-[1.5]"
              style={{ 
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontWeight: '400'
              }}
            >
              {renderRichText(block.bulleted_list_item.rich_text)}
                </div>
                {/* 渲染子块 */}
              {block.children && block.children.length > 0 && (
                  <div className="mt-2">
                    {block.children.map((child, childIndex) => 
                      renderBlock(child, childIndex, `${listContext || 'main'}-bullet`, 0)
                    )}
                </div>
              )}
              </div>
            </div>
          </div>
        );

      case 'numbered_list_item':
        // 中文注释: 为有序列表预处理编号
        let currentNumber = 1;
        
        // 在同一层级中计算当前项的编号
        if (listContext && listContext.includes('numbered')) {
          // 这是嵌套的有序列表，重新开始编号
          currentNumber = 1;
        } else {
          // 这是主列表，需要在相同层级的前面找到其他 numbered_list_item
          let foundItems = 0;
          for (let i = 0; i < processedBlocks.length; i++) {
            const currentBlock = processedBlocks[i];
            if (currentBlock.id === id) break;
            if (currentBlock.type === 'numbered_list_item') {
              foundItems++;
            }
          }
          currentNumber = foundItems + 1;
        }

        return (
          <div key={id} style={nestLevel === 0 ? {} : getIndentStyle(nestLevel)} className="my-2">
            <div className="flex items-start">
              <div 
                className="flex items-center justify-center text-gray-800"
              style={{ 
                  width: '28px',
                height: '24px',
                  fontSize: '16px',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontWeight: '400',
                display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {currentNumber}.
              </div>
              <div className="flex-1 min-w-0">
                <div 
                  className="text-gray-800 text-[16px] leading-[1.5]"
              style={{ 
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontWeight: '400'
              }}
            >
              {renderRichText(block.numbered_list_item.rich_text)}
                </div>
                {/* 渲染子块 */}
              {block.children && block.children.length > 0 && (
                  <div className="mt-2">
                    {block.children.map((child, childIndex) => 
                      renderBlock(child, childIndex, `${listContext || 'main'}-numbered`, 0)
                    )}
                </div>
              )}
              </div>
            </div>
          </div>
        );

      case 'image':
        // 中文注释: 优先使用本地路径，如果没有则使用远程URL
        const imageUrl = block.image.localPath || 
          (block.image.type === 'file' ? block.image.file.url : block.image.external.url);
        const altText = block.image.caption && block.image.caption.length > 0 
          ? renderRichText(block.image.caption) 
          : 'Image';

        // 中文注释: 检查是否在分栏环境中，调整移动端显示样式
        const isInColumn = listContext && listContext.includes('column');
        const imageWrapperClass = isInColumn 
          ? "my-2 w-full column-image-wrapper" // 分栏内：添加专用类名用于CSS样式控制
          : "my-2";

        return (
          <div key={id} className={imageWrapperClass} style={getIndentStyle(nestLevel)}>
            <ImageViewer 
              src={imageUrl} 
              alt={altText} 
              className={isInColumn ? "block w-full object-cover" : "block mx-auto"}
            >
              <img
                src={imageUrl}
                alt={altText}
                className={`max-w-full h-auto hover:opacity-90 transition-opacity duration-200 ${isInColumn ? 'column-image' : ''}`}
                style={{ 
                  display: 'block', 
                  margin: isInColumn ? '0' : '0 auto' // 分栏内不居中，非分栏内居中
                }}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.log('Image failed to load:', imageUrl);
                  e.target.style.display = 'none';
                }}
              />
            </ImageViewer>
            {block.image.caption && block.image.caption.length > 0 && (
              <div className="text-center text-gray-500 text-sm mt-2">
                {renderRichText(block.image.caption)}
              </div>
            )}
          </div>
        );

      case 'divider':
        return (
          <div key={id} className="my-8" style={getIndentStyle(nestLevel)}>
            <hr className="border-0 border-t border-gray-200" />
          </div>
        );

      case 'quote':
        return (
          <blockquote 
            key={id} 
            className="my-4 pl-4 border-l-4 border-gray-300 text-gray-700 italic"
            style={{ 
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: '400',
              fontSize: '16px',
              lineHeight: '1.5',
              ...getIndentStyle(nestLevel)
            }}
          >
            {renderRichText(block.quote.rich_text)}
          </blockquote>
        );

      case 'code':
        return (
          <div key={id} className="my-4" style={getIndentStyle(nestLevel)}>
            <pre className="bg-gray-100 border border-gray-200 rounded-lg p-4 overflow-x-auto">
              <code 
                className="text-gray-800 text-[14px]"
                style={{ 
                  fontFamily: "'JetBrains Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace",
                  fontWeight: '400'
                }}
              >
                {renderRichText(block.code.rich_text)}
              </code>
            </pre>
            {block.code.caption && block.code.caption.length > 0 && (
              <div className="text-gray-500 text-sm mt-2">
                {renderRichText(block.code.caption)}
              </div>
            )}
          </div>
        );

      case 'table':
        return (
          <div key={id} className="my-4 overflow-x-auto" style={getIndentStyle(nestLevel)}>
            <table className="min-w-full border border-gray-200 rounded-lg">
              <tbody>
                {block.children && block.children.map((row, rowIndex) => (
                  <tr key={row.id} className={rowIndex === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {row.table_row && row.table_row.cells.map((cell, cellIndex) => {
                      const CellTag = rowIndex === 0 ? 'th' : 'td';
                      return (
                        <CellTag 
                          key={cellIndex}
                          className={`border border-gray-200 px-4 py-2 text-left ${
                            rowIndex === 0 ? 'font-semibold text-gray-900' : 'text-gray-800'
                          }`}
              style={{ 
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                            fontSize: '14px'
                          }}
                        >
                          {renderRichText(cell)}
                        </CellTag>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
              </div>
        );

      case 'column_list':
        const columnCount = block.children?.length || 1;
        
        // 中文注释: 根据 column 数量计算合适的比例
        const getColumnWidths = (count) => {
          switch (count) {
            case 1:
              return ['100%'];
            case 2:
              return ['50%', '50%']; // 默认 1:1 比例
            case 3:
              return ['33.333%', '33.333%', '33.334%']; // 1:1:1 比例
            case 4:
              return ['25%', '25%', '25%', '25%']; // 1:1:1:1 比例
            default:
              // 超过4列时，使用等宽
              const width = (100 / count).toFixed(3) + '%';
              return Array(count).fill(width);
          }
        };
        
        const columnWidths = getColumnWidths(columnCount);
        
        return (
          <div key={id} className="my-4 column-list-container" style={getIndentStyle(nestLevel)}>
            {/* 中文注释: 桌面端横向分栏，移动端堆叠 */}
            <div className="flex flex-col md:flex-row gap-4">
              {block.children && block.children.map((column, columnIndex) => (
                <div 
                  key={column.id} 
                  className="min-w-0 flex-shrink-0 column-item"
                  style={{
                    // 中文注释: 移动端全宽，桌面端按比例分配
                    width: columnIndex < columnWidths.length ? columnWidths[columnIndex] : 'auto'
                  }}
                >
                  {column.children && column.children.map((child, childIndex) => 
                    renderBlock(child, childIndex, `${listContext || 'main'}-column`, nestLevel)
                  )}
                </div>
              ))}
            </div>
            
            {/* 中文注释: 移动端响应式样式 - 确保分栏和图片在移动端全宽显示 */}
            <style jsx>{`
              /* 移动端分栏样式覆盖 */
              @media (max-width: 767px) {
                .column-list-container .column-item {
                  width: 100% !important;
                }
                
                .column-image-wrapper {
                  width: 100% !important;
                }
                
                .column-image {
                  width: 100% !important;
                  margin: 0 !important;
                }
              }
            `}</style>
          </div>
        );

      case 'column':
        // 中文注释: column 块通常由 column_list 处理，这里作为备用
          return (
          <div key={id} className="my-2" style={getIndentStyle(nestLevel)}>
            {block.children && block.children.map((child, childIndex) => 
              renderBlock(child, childIndex, `${listContext || 'main'}-column`, nestLevel)
            )}
          </div>
        );

      case 'embed':
        const embedUrl = block.embed.url;
        return (
          <div key={id} className="my-4" style={getIndentStyle(nestLevel)}>
            <div className="relative w-full h-96 border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                title="Embedded content"
                style={{ border: 'none' }}
                sandbox="allow-same-origin allow-scripts allow-forms allow-presentation"
                referrerPolicy="no-referrer"
                allowFullScreen
                onError={(e) => {
                  // 中文注释: embed iframe加载失败时的错误处理
                  console.log('Embed iframe failed to load:', e);
                }}
              />
            </div>
            {block.embed.caption && block.embed.caption.length > 0 && (
              <div className="text-center text-gray-500 text-sm mt-2">
                {renderRichText(block.embed.caption)}
              </div>
            )}
          </div>
        );

      case 'video':
        // 中文注释: 优先使用本地路径，如果没有则使用远程URL
        const videoUrl = block.video.localPath || 
          (block.video.type === 'file' ? block.video.file.url : block.video.external.url);
        
        // 中文注释: 如果没有本地路径，显示提示信息
        if (!block.video.localPath) {
          return (
            <div key={id} className="my-4" style={getIndentStyle(nestLevel)}>
              <div className="border border-gray-200 rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                <div className="text-4xl mb-2">🎥</div>
                <div className="text-[14px] font-medium mb-2">视频正在处理中</div>
                <div className="text-[12px]">
                  视频文件正在下载到本地，请联系管理员重新同步项目内容以获得更好的加载体验
                </div>
              </div>
              {block.video.caption && block.video.caption.length > 0 && (
                <div className="text-center text-gray-500 text-sm mt-2">
                  {renderRichText(block.video.caption)}
                </div>
              )}
            </div>
          );
        }

        return (
          <div key={id} className="my-4" style={getIndentStyle(nestLevel)}>
            <div className="relative w-full">
              <video 
                controls 
                className="w-full rounded-lg"
                style={{ maxHeight: '500px' }}
                onError={(e) => {
                  console.log('Video failed to load:', videoUrl);
                  // 中文注释: 视频加载失败时的处理
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/webm" />
                <source src={videoUrl} type="video/ogg" />
                您的浏览器不支持视频播放。
              </video>
            </div>
            {block.video.caption && block.video.caption.length > 0 && (
              <div className="text-center text-gray-500 text-sm mt-2">
                {renderRichText(block.video.caption)}
              </div>
            )}
            </div>
          );

      // 新增: 改进的 Bookmark 卡片支持
      case 'bookmark':
        return (
          <div key={id} style={getIndentStyle(nestLevel)}>
            <BookmarkCard 
              url={block.bookmark.url} 
              caption={block.bookmark.caption}
            />
          </div>
        );

      // 新增: File 文件支持
      case 'file':
        return (
          <div key={id} style={getIndentStyle(nestLevel)}>
            <FileCard 
              file={block.file}
              caption={block.file.caption}
            />
          </div>
        );

      // 新增: PDF 文件支持
      case 'pdf':
        return (
          <div key={id} style={getIndentStyle(nestLevel)}>
            <PDFCard 
              file={block.pdf}
              caption={block.pdf.caption}
            />
          </div>
        );

      case 'to_do':
        return (
          <div key={id} className="flex items-start gap-2 my-2" style={getIndentStyle(nestLevel)}>
            <input 
              type="checkbox" 
              checked={block.to_do.checked} 
              readOnly
              className="mt-1 rounded"
            />
            <div 
              className={`text-[16px] leading-[1.5] ${block.to_do.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}
            style={{ 
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: '400'
            }}
          >
              {renderRichText(block.to_do.rich_text)}
            </div>
          </div>
        );

      default:
        // 改进的不支持块类型处理
        console.log(`Unsupported block type: ${type}`, block);
        
        // 尝试从块中提取文本内容
        let richText = null;
        if (block[type] && block[type].rich_text) {
          richText = block[type].rich_text;
        } else if (block[type] && block[type].text) {
          richText = block[type].text;
        }

        if (richText && richText.length > 0) {
        return (
            <div 
              key={id} 
              className="mb-1 text-gray-800 text-[16px] leading-[1.5] p-2 bg-yellow-50 border border-yellow-200 rounded"
              style={{ 
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: '400',
                ...getIndentStyle(nestLevel)
              }}
            >
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-yellow-600 mb-1">Unsupported block type: {type}</div>
              )}
              {renderRichText(richText)}
            </div>
          );
        }

        // 如果有子块，仍然尝试渲染子块
        if (block.children && block.children.length > 0) {
      return (
            <div key={id} className="my-2" style={getIndentStyle(nestLevel)}>
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 mb-1">Unsupported block type: {type}</div>
              )}
              {block.children.map((child, childIndex) => renderBlock(child, childIndex, `${listContext || 'main'}-unsupported`, nestLevel))}
            </div>
          );
        }

        // 在生产环境中，不支持的块类型不显示警告，只在开发环境显示
        return process.env.NODE_ENV === 'development' ? (
          <div key={id} className="text-xs text-gray-400 my-1" style={getIndentStyle(nestLevel)}>
            [Unsupported block type: {type}]
          </div>
        ) : null;
    }
  };

  // 中文注释: 简化的块渲染逻辑 - 不再合并列表，直接渲染所有块
  // 这样可以确保子列表和嵌套结构正确显示
  return (
    <div className="notion-content max-w-none">
      {processedBlocks.map((block, index) => {
        try {
          return renderBlock(block, index, 'main', 0);
        } catch (error) {
          console.error('Error rendering block:', error, block);
          return (
            <div key={block.id} className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm my-2">
              Error rendering block: {block.type}
            </div>
          );
        }
      })}
      
      {/* 中文注释: NotionContent移动端响应式样式 */}
      <style jsx>{`
        @media (max-width: 480px) {
          :global(.notion-heading-1) {
            font-size: 26px !important; /* 移动端内容一号标题26px */
          }
        }
      `}</style>
    </div>
  );
} 