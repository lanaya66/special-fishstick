import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { getProjectImage } from '../lib/project-images.js';
import { useState, useEffect } from 'react';

/**
 * Project Menu Item Component
 * Renders a single item in the project selection dropdown menu.
 * It handles default, hover, and selected states.
 * Size: 400*104 (desktop), 288*88 (mobile), Image: 108*72 (desktop), 72*48 (mobile)
 */
export default function ProjectMenuItem({ project, isSelected, forceDesktopStyle = false, mobileFullWidth = false }) {
  const { i18n } = useTranslation();
  const [isMobileView, setIsMobileView] = useState(false);

  // 检查是否为移动端视图
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 480);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const getTagsText = () => {
    return Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || '');
  };

  const handleProjectChange = (e, slug) => {
    e.preventDefault();
    const newUrl = `/project/${slug}?lang=${i18n.language}`;
    // Use window.location to force a full page reload, ensuring all states are reset correctly
    window.location.href = newUrl;
  };

  // 移动端和桌面端不同的尺寸配置
  const useDesktopStyle = !isMobileView || forceDesktopStyle;
  const useMobileFullWidth = isMobileView && mobileFullWidth;
  
  const dimensions = useDesktopStyle ? {
    width: useMobileFullWidth ? '100%' : 400,
    height: 104,
    imageWidth: 108,
    imageHeight: 72,
    padding: 16,
    gap: 16
  } : {
    width: useMobileFullWidth ? '100%' : 288,
    height: 88,
    imageWidth: 72,
    imageHeight: 48,
    padding: 12,
    gap: 12
  };

  return (
    <>
      <a
        href={`/project/${project.slug}?lang=${i18n.language}`}
        onClick={(e) => handleProjectChange(e, project.slug)}
        className={`menu-item ${isSelected ? 'selected' : ''} ${useDesktopStyle ? 'desktop' : 'mobile'} ${useMobileFullWidth ? 'mobile-full-width' : ''}`}
        style={useMobileFullWidth ? { width: '100%', maxWidth: '100%' } : {}}
      >
        {/* hover 渐变边框容器 - 只在 hover 时显示 */}
        <div className="hover-border-container">
          <div className="hover-border-gradient">
            <div className="hover-border-inner" />
          </div>
        </div>

        {/* 内容容器 */}
        <div 
          className="relative w-full h-full flex flex-row items-center"
          style={{ 
            padding: `${dimensions.padding}px`,
            gap: `${dimensions.gap}px`
          }}
        >
          {/* 项目图片 */}
          <div 
            className="relative flex-shrink-0"
            style={{ 
              width: `${dimensions.imageWidth}px`, 
              height: `${dimensions.imageHeight}px` 
            }}
          >
            <div className="relative w-full h-full rounded-[6px] overflow-hidden">
              <img
                src={getProjectImage(project.name)}
                alt={project.name}
                className="w-full h-full object-contain bg-white"
              />
            </div>
            
            {/* 图片边框和阴影 */}
            <div className="absolute border-2 border-[#D2DDD0] border-solid inset-[-2px] pointer-events-none rounded-[6px] shadow-[0px_4px_16px_0px_rgba(112,127,91,0.08)]" />
          </div>

          {/* 项目信息 */}
          <div 
            className="flex-1 min-w-0 flex flex-col justify-center" 
            style={{ height: `${dimensions.imageHeight}px` }}
          >
            {/* 项目名称 */}
            <h3 
              className={`font-semibold text-[#323335] leading-normal mb-1 ${useDesktopStyle ? 'text-base' : 'text-sm'} ${useMobileFullWidth ? 'truncate' : 'truncate'}`}
              style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              {project.name}
            </h3>
            
            {/* 项目标签 */}
            <p 
              className={`font-semibold text-[#477c4d] leading-normal mb-1 ${useDesktopStyle ? 'text-sm' : 'text-xs'} ${useMobileFullWidth ? 'truncate' : 'truncate'}`}
              style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              {getTagsText()}
            </p>
            
            {/* 项目时间范围 */}
            <span 
              className={`font-medium text-[rgba(50,51,53,0.56)] leading-normal ${useDesktopStyle ? 'text-sm' : 'text-xs'}`}
              style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              {project.timeRange || project.year}
            </span>
          </div>
        </div>

        {/* 样式定义 */}
        <style jsx>{`
          .menu-item {
            display: block;
            border-radius: 8px;
            transition: all 0.3s ease;
            position: relative;
            cursor: pointer;
            text-decoration: none;
            /* 默认状态：无边框、无阴影、无背景 */
            background: transparent;
            border: none;
            box-shadow: none;
          }

          .menu-item.desktop {
            width: 400px;
            height: 104px;
          }

          .menu-item.mobile {
            width: 288px;
            height: 88px;
          }
          
          .menu-item.mobile-full-width {
            width: 100% !important;
            max-width: 100% !important;
          }

          .menu-item:hover {
            background: #f6f8f6;
          }

          .menu-item.selected {
            background: #f6f8f6;
          }

          /* hover 渐变边框样式 */
          .hover-border-container {
            position: absolute;
            inset: -2px;
            border-radius: 10px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }

          .menu-item:hover .hover-border-container {
            opacity: 1;
          }

          .hover-border-gradient {
            width: 100%;
            height: 100%;
            background: linear-gradient(270deg, #FFEADC -2.63%, #AFC2FF 21.79%, #A3CDE5 50.66%, #98D096 113.2%);
            border-radius: 10px;
            padding: 2px;
          }

          .hover-border-inner {
            width: 100%;
            height: 100%;
            background: linear-gradient(270deg, #FDFBF6 -2.63%, #F5F7FA 21.79%, #F4F8F6 50.66%, #F3F8EF 113.2%);
            border-radius: 8px;
          }
        `}</style>
      </a>
    </>
  );
} 