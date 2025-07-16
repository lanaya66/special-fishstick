import { useState, useEffect } from 'react';

/**
 * 图片查看器组件 - 支持点击图片放大查看
 * @param {string} src - 图片源地址
 * @param {string} alt - 图片alt文本
 * @param {React.ReactNode} children - 触发元素
 * @returns {JSX.Element} 图片查看器
 */
export default function ImageViewer({ src, alt, children, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  // 中文注释: 监听ESC键关闭
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // 禁止背景滚动
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto'; // 恢复滚动
    };
  }, [isOpen]);

  return (
    <>
      {/* 中文注释: 触发元素 - 点击打开图片查看器 */}
      <div 
        onClick={() => setIsOpen(true)}
        className={`cursor-pointer ${className}`}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>

      {/* 中文注释: 图片查看器模态框 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.54)',  // 中文注释: 降低不透明度，让蒙层更透明
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px' // 中文注释: 添加内边距防止图片贴边
          }}
        >
          {/* 中文注释: 背景遮罩 - 点击关闭 */}
          <div 
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />

          {/* 中文注释: 关闭按钮 */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200"
            style={{ color: 'white' }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* 中文注释: 图片容器 - 不占用全部空间，只包裹图片实际尺寸 */}
          <div 
            className="relative inline-block"
            style={{
              maxWidth: 'calc(100vw - 40px)', // 中文注释: 限制最大宽度
              maxHeight: 'calc(100vh - 40px)', // 中文注释: 限制最大高度
            }}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain"
              style={{
                display: 'block', // 中文注释: 确保图片作为块级元素显示
                maxWidth: 'calc(100vw - 40px)',
                maxHeight: 'calc(100vh - 40px)',
                width: 'auto',
                height: 'auto'
              }}
              onClick={(e) => e.stopPropagation()} // 中文注释: 只阻止图片本身的点击事件
              onError={(e) => {
                console.log('Large image failed to load:', src);
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
} 