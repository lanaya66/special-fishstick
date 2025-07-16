import { useState, useEffect } from 'react';

/**
 * Loading动画组件 - 使用多张图片实现堆叠轮换效果
 */
export default function LoadingAnimation() {
  // 中文注释: 图片文件名列表
  const imageFiles = [
    'IMG_2830.png',
    'IMG_7713.png', 
    'IMG_3947.png',
    'IMG_3961.png',
    'IMG_3962.png',
    'IMG_3964.png',
    'IMG_4760.png',
    'image 2.png',
    'image 3.png',
    'IMG_2831.png',
    'IMG_2880.png'
  ];

  const [shuffledImages, setShuffledImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipStage, setFlipStage] = useState(0); // 中文注释: 翻牌阶段状态 0=正常 1=翻到侧边 2=滑到底层
  const [nextCardProgress, setNextCardProgress] = useState(0); // 中文注释: 下一张牌的连续进度 0-1

  // 中文注释: 随机打乱图片顺序
  useEffect(() => {
    const shuffled = [...imageFiles].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, []);

  // 中文注释: 自动轮换动画 - 分阶段控制
  useEffect(() => {
    if (shuffledImages.length === 0) return;
    
    const startFlipSequence = () => {
      // 中文注释: 开始下一张牌的连续上升动画
      const animateNextCard = () => {
        const startTime = Date.now();
        const duration = 700; // 中文注释: 总动画时长700ms
        
        const updateProgress = () => {
          const elapsed = Date.now() - startTime;
          const rawProgress = Math.min(elapsed / duration, 1);
          
          // 中文注释: 使用 ease-in-out 缓动函数，让变化更自然
          const easeInOut = (t) => {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          };
          
          const smoothProgress = easeInOut(rawProgress);
          setNextCardProgress(smoothProgress);
          
          if (rawProgress < 1) {
            requestAnimationFrame(updateProgress);
          } else {
            // 中文注释: 动画完成后重置
            setTimeout(() => {
              setCurrentIndex((prev) => (prev + 1) % shuffledImages.length);
              setFlipStage(0);
              setNextCardProgress(0);
            }, 100);
          }
        };
        
        requestAnimationFrame(updateProgress);
      };
      
      // 中文注释: 阶段1：翻到侧边，同时开始下一张牌动画
      setFlipStage(1);
      animateNextCard();
      
      setTimeout(() => {
        // 中文注释: 阶段2：滑到底层
        setFlipStage(2);
      }, 200); // 中文注释: 翻牌阶段持续200ms
    };

    const interval = setInterval(startFlipSequence, 1500); // 中文注释: 每1500ms开始一次完整序列，在顶部停留更久

    return () => clearInterval(interval);
  }, [shuffledImages.length]);

  // 中文注释: 计算图片样式 - 包含翻拍效果
  const getImageStyle = (index, totalLength) => {
    const isActive = index === currentIndex;
    const relativeIndex = (index - currentIndex + totalLength) % totalLength;
    const isNextCard = relativeIndex === 1; // 中文注释: 下一张即将成为顶牌的卡片
    
    // 中文注释: 基础倾斜角度和偏移位置
    const baseRotations = [8, -12, 15, -8, 10, -15, 12, -10, 6, -14, 11];
    const baseOffsets = [
      { x: 0, y: 0 },
      { x: 2, y: 1 },
      { x: -1, y: 2 },
      { x: 3, y: -1 },
      { x: -2, y: 3 },
      { x: 1, y: -2 },
      { x: -3, y: 1 },
      { x: 2, y: 2 },
      { x: -1, y: -1 },
      { x: 3, y: 0 },
      { x: -2, y: -1 }
    ];

    const baseRotation = baseRotations[index % baseRotations.length];
    const offset = baseOffsets[index % baseOffsets.length];
    
    // 中文注释: 计算不透明度：与动作同步变化
    let opacity;
    if (isActive) {
      if (flipStage === 0) {
        opacity = 1; // 正常状态：完全不透明
      } else if (flipStage === 1) {
        opacity = 0.4; // 翻牌阶段：保持一定可见度
      } else if (flipStage === 2) {
        opacity = 0.1; // 滑动阶段：逐渐透明
      }
    } else if (isNextCard && (flipStage === 1 || flipStage === 2)) {
      // 中文注释: 下一张牌在上升过程中透明度连续增加
      const progress = nextCardProgress; // 使用连续的进度值
      const startOpacity = Math.max(0.05, 1 - 1 * 0.15); // 原本的第二层透明度
      const endOpacity = 1; // 最终的顶层透明度
      opacity = startOpacity + (endOpacity - startOpacity) * progress;
    } else {
      opacity = Math.max(0.05, 1 - relativeIndex * 0.15); // 其他层级按递减计算
    }
    
    // 中文注释: 计算缩放：最前面150%，其他100%
    const scale = isActive ? 1.5 : 1;
    
    // 中文注释: 计算z-index：翻牌过程中动态调整层级
    let zIndex;
    if (isActive) {
      if (flipStage === 0) {
        zIndex = totalLength; // 正常时最高层
      } else if (flipStage === 1) {
        zIndex = Math.floor(totalLength / 2); // 翻牌时降到中层
      } else if (flipStage === 2) {
        zIndex = 1; // 滑动时降到最底层
      }
    } else if (isNextCard && (flipStage === 1 || flipStage === 2)) {
      zIndex = totalLength - 1; // 下一张牌在翻牌过程中上升到接近顶层
    } else {
      zIndex = totalLength - relativeIndex; // 其他卡片保持原层级
    }
    
    // 中文注释: 根据翻牌阶段计算图片变换
    let transform = '';
    
    if (isActive) {
      // 中文注释: 顶层图片：根据翻牌阶段应用不同变换
      if (flipStage === 0) {
        // 正常状态：放大并稍微调整位置
        transform = `translate(-50%, -50%) translate(${offset.x * 0.3}px, ${offset.y * 0.3}px) rotate(${baseRotation}deg) scale(${scale})`;
      } else if (flipStage === 1) {
        // 翻牌阶段：向左侧翻转，为后续滑动做准备
        const flipRotation = baseRotation + (baseRotation > 0 ? 45 : -45);
        transform = `translate(-50%, -50%) translate(-50px, -20px) rotate(${flipRotation}deg) scale(0.9)`;
      } else if (flipStage === 2) {
        // 滑动阶段：从侧边弧形滑到底层位置
        const bottomRotation = baseRotation * 0.6;
        // 中文注释: 创建一个弧形轨迹，从右侧滑入底层
        transform = `translate(-50%, -50%) translate(15px, 15px) rotate(${bottomRotation}deg) scale(0.75)`;
      }
    } else if (isNextCard && (flipStage === 1 || flipStage === 2)) {
      // 中文注释: 下一张牌使用连续进度值流畅上升到顶层位置
      const progress = nextCardProgress; // 使用连续的进度值 0-1
      
      // 中文注释: 平滑插值计算所有属性
      const startScale = 1;
      const endScale = 1.5;
      const currentScale = startScale + (endScale - startScale) * progress;
      
      const startOffsetMultiplier = 1;
      const endOffsetMultiplier = 0.3;
      const currentOffsetMultiplier = startOffsetMultiplier + (endOffsetMultiplier - startOffsetMultiplier) * progress;
      
      transform = `translate(-50%, -50%) translate(${offset.x * currentOffsetMultiplier}px, ${offset.y * currentOffsetMultiplier}px) rotate(${baseRotation}deg) scale(${currentScale})`;
    } else {
      // 中文注释: 普通后层图片：标准位置
      transform = `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${baseRotation}deg) scale(${scale})`;
    }

    // 中文注释: 根据翻牌阶段调整过渡时间
    let transitionDuration;
    if (isActive) {
      if (flipStage === 1) {
        transitionDuration = '0.2s'; // 翻牌快速
      } else if (flipStage === 2) {
        transitionDuration = '0.5s'; // 滑动流畅
      } else {
        transitionDuration = '0.4s'; // 回到顶部稍慢
      }
    } else if (isNextCard && (flipStage === 1 || flipStage === 2)) {
      // 中文注释: 下一张牌使用 JavaScript 动画，不需要 CSS 过渡
      transitionDuration = '0s'; // 禁用CSS过渡，使用requestAnimationFrame控制
    } else {
      transitionDuration = '0.6s'; // 其他卡片变换较慢，保持稳定
    }

    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform,
      opacity,
      zIndex,
      transition: `all ${transitionDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94)`, // 中文注释: 动态过渡时间，使用更流畅的缓动函数
      transformOrigin: 'center center'
    };
  };

  if (shuffledImages.length === 0) return null;

  return (
    <div className="loading-animation-container">
      <div 
        className="relative"
        style={{
          width: '200px',
          height: '200px',
          margin: '0 auto'
        }}
      >
        {shuffledImages.map((imagePath, index) => (
          <img
            key={`${imagePath}-${index}`}
            src={`/loading/${imagePath}`}
            alt="Loading"
            style={{
              ...getImageStyle(index, shuffledImages.length),
              width: '80px',
              height: '80px',
              objectFit: 'cover'
            }}
            onError={(e) => {
              console.log('Loading image failed to load:', imagePath);
              e.target.style.display = 'none';
            }}
          />
        ))}
      </div>
      
      {/* 中文注释: 样式定义 */}
      <style jsx>{`
        .loading-animation-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        
        .loading-animation-container img {
          /* 中文注释: 使用CSS让图片更清晰 */
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
} 