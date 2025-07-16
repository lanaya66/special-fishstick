import { useState, useEffect } from 'react';

/**
 * 滑出动画组件 - 图片从中间堆叠依次向右滑出并渐隐
 */
export default function SlideOutAnimation() {
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
  const [slidingIndex, setSlidingIndex] = useState(-1); // 中文注释: 当前滑出的图片索引，-1表示无图片滑出

  // 中文注释: 随机打乱图片顺序
  useEffect(() => {
    const shuffled = [...imageFiles].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, []);

  // 中文注释: 自动滑出动画序列
  useEffect(() => {
    if (shuffledImages.length === 0) return;
    
    const startSlideSequence = () => {
      let currentIndex = 0;
      
      const slideNext = () => {
        if (currentIndex < shuffledImages.length) {
          setSlidingIndex(currentIndex);
          currentIndex++;
          
          // 中文注释: 1.5秒后滑出下一张
          setTimeout(slideNext, 1500);
        } else {
          // 中文注释: 全部滑完后重新开始
          setTimeout(() => {
            setSlidingIndex(-1);
            // 中文注释: 重新打乱图片顺序
            const reshuffled = [...imageFiles].sort(() => Math.random() - 0.5);
            setShuffledImages(reshuffled);
            setTimeout(startSlideSequence, 1000);
          }, 2000);
        }
      };
      
      slideNext();
    };

    // 中文注释: 组件加载后2秒开始动画
    const timer = setTimeout(startSlideSequence, 2000);
    return () => clearTimeout(timer);
  }, [shuffledImages]);

  // 中文注释: 计算图片样式
  const getImageStyle = (index) => {
    const isSliding = index === slidingIndex;
    const hasSlided = index < slidingIndex;
    
    // 中文注释: 基础堆叠位置
    const stackOffset = index * 2; // 轻微堆叠效果
    const rotation = (index % 3 - 1) * 3; // 轻微旋转变化
    
    if (hasSlided) {
      // 中文注释: 已经滑出的图片，完全隐藏
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translateX(300px) rotate(${rotation}deg) scale(0.8)`,
        opacity: 0,
        zIndex: shuffledImages.length - index,
        transition: 'none',
        transformOrigin: 'center center'
      };
    } else if (isSliding) {
      // 中文注释: 正在滑出的图片
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translateX(300px) rotate(${rotation + 10}deg) scale(0.7)`,
        opacity: 0,
        zIndex: shuffledImages.length - index,
        transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transformOrigin: 'center center'
      };
    } else {
      // 中文注释: 堆叠在中间的图片
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translate(${stackOffset}px, ${stackOffset}px) rotate(${rotation}deg) scale(1)`,
        opacity: index === 0 ? 1 : 0.8 - index * 0.1, // 顶层最亮，向下递减
        zIndex: shuffledImages.length - index,
        transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
        transformOrigin: 'center center'
      };
    }
  };

  if (shuffledImages.length === 0) return null;

  return (
    <div className="slide-out-container">
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
            alt="Sliding"
            style={{
              ...getImageStyle(index),
              width: '80px',
              height: '80px',
              objectFit: 'cover'
            }}
            onError={(e) => {
              console.log('Slide image failed to load:', imagePath);
              e.target.style.display = 'none';
            }}
          />
        ))}
      </div>
      
      {/* 中文注释: 样式定义 */}
      <style jsx>{`
        .slide-out-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        
        .slide-out-container img {
          /* 中文注释: 使用CSS让图片更清晰 */
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
} 