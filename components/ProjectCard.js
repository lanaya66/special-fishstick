import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getProjectImage } from '../lib/project-images.js';

//-------------- ProjectCard 组件 --------------

/**
 * 项目卡片组件 - 支持三种响应式布局
 * @param {Object} project - 项目数据
 * @returns {JSX.Element} 项目卡片
 */
export default function ProjectCard({ project }) {
  const { i18n } = useTranslation();

  // 中文注释: 状态管理
  const [isHovered, setIsHovered] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 240, height: 160 });
  const [layoutType, setLayoutType] = useState('horizontal'); // 'horizontal' | 'square' | 'mobile'
  const cardRef = useRef(null);

  // 中文注释: 检测卡片宽度并设置布局类型
  const checkCardWidth = () => {
    if (!cardRef.current) return;
    
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        
        if (width >= 660) {
          setLayoutType('horizontal');
          setImageDimensions({ width: 240, height: 160 });
                 } else if (width >= 300) {
           setLayoutType('square');
           // 中文注释: 方形布局，图片宽度等于card-48px，保持240:160比例
           const imageWidth = width - 48; // 减去padding，图片占满可用宽度
           const imageHeight = (imageWidth * 160) / 240;
           setImageDimensions({ width: imageWidth, height: imageHeight });
        } else {
          setLayoutType('mobile');
          // 中文注释: 移动端布局，图片适应容器宽度，保持240:160比例
          const imageWidth = Math.min(240, width - 40); // 减去padding
          const imageHeight = (imageWidth * 160) / 240;
          setImageDimensions({ width: imageWidth, height: imageHeight });
        }
      }
    });
    
    observer.observe(cardRef.current);
    
    return () => {
      observer.disconnect();
    };
  };

  useEffect(() => {
    return checkCardWidth();
  }, []);

  // 中文注释: 图片错误处理
  const handleImageError = () => {
    setImageDimensions({ width: 240, height: 160 });
  };

  // 中文注释: 获取图片源
  const getImageSrc = () => {
    return getProjectImage(project.name);
  };

  // 中文注释: 获取标签文本
  const getTagsText = () => {
    return Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || '');
  };

  return (
    <Link 
      href={`/project/${project.slug}?lang=${i18n.language}`}
      ref={cardRef}
      className="relative rounded-2xl cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%', // 中文注释: 使用100%宽度，严格跟随内容区
        height: layoutType === 'horizontal' ? '208px' : // 中文注释: 横向固定高度
                layoutType === 'mobile' ? 'auto' : 'auto', // 中文注释: mobile和方形使用自适应高度
        background: 'rgba(107, 140, 110, 0.06)' // 中文注释: 默认背景，hover通过边框内层实现
      }}
    >
      {/* 中文注释: 容器边框 - hover时使用渐变边框 */}
      {isHovered ? (
        // 中文注释: hover状态 - 渐变边框，确保背景不被遮挡
        <div 
          className="absolute inset-[-2px] pointer-events-none rounded-[18px] transition-all duration-300"
          style={{
            background: 'linear-gradient(270deg, #FFEADC -2.63%, #AFC2FF 21.79%, #A3CDE5 50.66%, #98D096 113.2%)',
            padding: '2px'
          }}
        >
          <div 
            className="w-full h-full rounded-[16px]" 
            style={{
              background: 'linear-gradient(270deg, #FDFBF6 -2.63%, #F5F7FA 21.79%, #F4F8F6 50.66%, #F3F8EF 113.2%)'
            }}
          />
        </div>
      ) : (
        // 中文注释: 默认状态 - 白色边框
        <div 
          className="absolute inset-[-2px] border-2 border-solid border-white pointer-events-none rounded-[18px] transition-all duration-300"
        />
      )}
      
      {/* 中文注释: 内容容器 - 三种布局模式，使用自适应高度 */}
      <div className="relative w-full">
        
        {layoutType === 'horizontal' ? (
          // 中文注释: 横向长条形布局 (内容区≥660px)
          <div className="flex flex-row gap-6 items-start p-[24px] h-[160px]">
            
            {/* 中文注释: 左侧图片区域 - 固定240x160尺寸 */}
            <div className="flex-none">
              <div className="relative w-[240px] h-[160px]">
                <div 
                  className="relative flex-shrink-0"
                  style={{ 
                    width: `${imageDimensions.width}px`, 
                    height: `${imageDimensions.height}px` 
                  }}
                >
                  <div className="relative w-full h-full rounded-[6px] overflow-hidden">
                    <img
                      src={getImageSrc()}
                      alt={project.name}
                      className="w-full h-full object-contain bg-white"
                      onError={handleImageError}
                    />
                  </div>
                  
                  {/* 图片边框和阴影 */}
                  <div className="absolute border-2 border-[#D2DDD0] border-solid inset-[-2px] pointer-events-none rounded-[6px] shadow-[0px_4px_16px_0px_rgba(112,127,91,0.08)]" />
                </div>
              </div>
            </div>

            {/* 中文注释: 右侧文字区域 */}
            <div className="flex flex-col justify-between flex-1 min-h-[160px]">
              
              {/* 中文注释: 标题组 */}
              <div className="flex flex-col gap-4 items-start justify-start w-full">
                {/* 中文注释: 项目标题 */}
                <h3 
                  className="text-[20px] font-semibold text-[#323335] leading-normal"
                  style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {project.name}
                </h3>
                
                {/* 中文注释: 标签文本 */}
                <p 
                  className="text-[14px] font-semibold text-[#477c4d] leading-normal"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {getTagsText()}
                </p>
              </div>

              {/* 中文注释: 年份 - 修改为左对齐 */}
              <div className="flex flex-row gap-2.5 h-6 items-center justify-start">
                <span 
                  className="text-[14px] font-semibold text-[rgba(50,51,53,0.56)] leading-none"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {project.year}
                </span>
              </div>
            </div>
          </div>
        ) : layoutType === 'mobile' ? (
          // 中文注释: 移动端布局 (屏幕<640px) - 自适应高度，精确间距控制
          <div className="pt-[20px] px-[20px] pb-[20px]">
            
            {/* 中文注释: 顶部标题区域 */}
            <div className="flex flex-row gap-2 items-start justify-between w-full mb-4">
              
              {/* 中文注释: 左侧标题组 */}
              <div className="flex flex-col gap-1 items-start justify-start flex-1">
                {/* 中文注释: 项目标题 */}
                <h3 
                  className="text-[18px] font-semibold text-[#323335] leading-normal"
                  style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {project.name}
                </h3>
                
                {/* 中文注释: 标签文本 */}
                <p 
                  className="text-[13px] font-semibold text-[#477c4d] leading-normal"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {getTagsText()}
                </p>
              </div>

              {/* 中文注释: 右侧年份 */}
              <div className="flex items-center">
                <span 
                  className="text-[13px] font-semibold text-[rgba(50,51,53,0.56)] leading-none"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {project.year}
                </span>
              </div>
            </div>

            {/* 中文注释: 图片区域 - 移动端动态尺寸 */}
            <div className="relative max-w-full">
              <div 
                className="relative mx-auto"
                style={{ 
                  width: `${imageDimensions.width}px`, 
                  height: `${imageDimensions.height}px` 
                }}
              >
                <div 
                  className="relative flex-shrink-0 rounded-[6px] overflow-hidden"
                  style={{ 
                    width: `${imageDimensions.width}px`, 
                    height: `${imageDimensions.height}px` 
                  }}
                >
                  <div className="relative w-full h-full rounded-[6px] overflow-hidden">
                    <img
                      src={getImageSrc()}
                      alt={project.name}
                      className="w-full h-full object-contain bg-white"
                      onError={handleImageError}
                    />
                  </div>
                  
                  {/* 图片边框和阴影 */}
                  <div className="absolute border-2 border-[#D2DDD0] border-solid inset-[-2px] pointer-events-none rounded-[6px] shadow-[0px_4px_16px_0px_rgba(112,127,91,0.08)]" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 中文注释: 方形布局 (640px≤屏幕<660px内容区) - 自适应高度，精确间距控制
          <div className="pt-[24px] px-[24px] pb-[24px]">
            
            {/* 中文注释: 顶部标题区域 - 在方形布局中不显示年份 */}
            <div className="flex flex-col gap-1.5 w-full mb-6">
              
              {/* 中文注释: 项目标题 - 单行显示，超出省略 */}
                <h3 
                className="text-[20px] font-semibold text-[#323335] leading-normal overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {project.name}
                </h3>
              
              {/* 中文注释: 标签文本单独一行 */}
              <p 
                className="text-[14px] font-semibold text-[#477c4d] leading-normal"
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                {getTagsText()}
              </p>
            </div>

            {/* 中文注释: 图片区域 - 方形布局动态尺寸 */}
            <div className="relative max-w-full">
              <div 
                className="relative mx-auto"
                style={{ 
                  width: `${imageDimensions.width}px`, 
                  height: `${imageDimensions.height}px` 
                }}
              >
                <div 
                  className="relative flex-shrink-0 rounded-[6px] overflow-hidden"
                  style={{ 
                    width: `${imageDimensions.width}px`, 
                    height: `${imageDimensions.height}px` 
                  }}
                >
                  <div className="relative w-full h-full rounded-[6px] overflow-hidden">
                    <img
                      src={getImageSrc()}
                      alt={project.name}
                      className="w-full h-full object-contain bg-white"
                      onError={handleImageError}
                    />
                  </div>
                  
                  {/* 图片边框和阴影 */}
                  <div className="absolute border-2 border-[#D2DDD0] border-solid inset-[-2px] pointer-events-none rounded-[6px] shadow-[0px_4px_16px_0px_rgba(112,127,91,0.08)]" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Link>
  );
} 