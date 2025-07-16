import { useState } from 'react';
import Head from 'next/head';
import SlideOutAnimation from '../components/SlideOutAnimation';
import LoadingAnimation from '../components/LoadingAnimation';

/**
 * 动画演示页面 - 展示两种不同的动画效果
 */
export default function SlideDemo() {
  const [currentAnimation, setCurrentAnimation] = useState('slide'); // 'slide' 或 'flip'

  return (
    <>
      <Head>
        <title>动画演示 - Lanaya Shi</title>
        <meta name="description" content="Loading animations demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          {/* 中文注释: 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              动画效果演示
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              两种不同的加载动画效果
            </p>
            
            {/* 中文注释: 动画切换按钮 */}
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setCurrentAnimation('slide')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentAnimation === 'slide' 
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                滑出动画
              </button>
              <button
                onClick={() => setCurrentAnimation('flip')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentAnimation === 'flip' 
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                翻牌动画
              </button>
            </div>
          </div>

          {/* 中文注释: 动画展示区域 */}
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {currentAnimation === 'slide' ? '滑出效果' : '翻牌效果'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {currentAnimation === 'slide' 
                    ? '图片从中间堆叠依次向右滑出并渐隐消失' 
                    : '顶层卡片翻转到侧边然后滑到底层，下层卡片同步上升'
                  }
                </p>
              </div>
              
              {/* 中文注释: 动画组件展示 */}
              <div className="flex justify-center items-center" style={{ height: '300px' }}>
                {currentAnimation === 'slide' ? (
                  <SlideOutAnimation />
                ) : (
                  <LoadingAnimation />
                )}
              </div>
            </div>
          </div>

          {/* 中文注释: 效果说明 */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">动画特点</h3>
              
              {currentAnimation === 'slide' ? (
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>图片在中间轻微堆叠，营造层次感</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>顶部图片依次向右滑出屏幕</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>滑出过程中透明度逐渐降至0%</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>全部滑完后重新开始循环</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>顶层卡片翻转到侧边，同时z轴下沉</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>下一张卡片同步上升，流畅过渡到顶层</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>翻转卡片从侧边滑动到底层位置</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>真实模拟物理翻牌的层级变化</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 