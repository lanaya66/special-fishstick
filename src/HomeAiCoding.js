import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

//-------------- 图片资源常量 --------------
// 中文注释: 使用public目录下的真实项目图片
const imgFrame63 = "/1Zoom Docs - Contextual AI tools.png"; // Frame 63
const imgFrame62 = "/2Zoom Docs - Ask AI Companion1.png"; // Frame 62  
const imgFrame64 = "/3Zoom Docs - AI meeting doc.png"; // Frame 64
const imgFrame65 = "/4Zoom Docs - Page editor.png"; // Frame 65
const imgFrame66 = "/5Light - Mainsite.png"; // Frame 66
const imgFrame68 = "/6Light - GTD.png"; // Frame 68
const imgFrame67 = "/7希悦校园 Chalk.png"; // Frame 67

//-------------- 主页组件 --------------
export default function HomeAiCoding() {
  const { t, i18n } = useTranslation();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 改为弹窗状态
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [passwordState, setPasswordState] = useState('input'); // 'input', 'success'
  const [pageHeight, setPageHeight] = useState('200vh'); // 中文注释: 动态计算页面高度
  const cardRef = useRef(null);
  const mainContainerRef = useRef(null); // 中文注释: 主容器ref用于计算高度

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageDropdownOpen(false);
  };

  // 中文注释: 处理卡片点击，打开弹窗
  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  // 中文注释: 关闭弹窗
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPassword('');
    setError('');
    setPasswordState('input');
  };

  // 中文注释: 处理密码提交
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'lanaya2024') {
      setError('');
      setPasswordState('success');
      
      // 中文注释: 打开对应语言的Notion链接
      //const notionUrl = 'https://www.notion.so/20258f61591a80a8bd47d569527b70ef?v=21d58f61591a80198a7b000c497dba0f&source=copy_link';
      const notionUrl = i18n.language === 'zh' 
      ? 'https://www.notion.so/20258f61591a80a8bd47d569527b70ef?v=21d58f61591a80198a7b000c497dba0f&source=copy_link' 
      : 'https://www.notion.so/21f58f61591a80c0a4dde31f65ab8e81?v=21f58f61591a81e89dbe000c3368d0a1&source=copy_link';
      window.open(notionUrl, '_blank');


      
      // 中文注释: 3秒后关闭弹窗
      setTimeout(() => {
        handleCloseModal();
      }, 3000);
    } else {
      setError(t('passwordError', 'Incorrect password. Please try again.'));
    }
  };

  const experiences = [
    {
      company: 'Zoom',
      period: '2023.04 - 2024.09',
      tags: 'AI, Doc editor, Collaborative tool',
      description: t('zoomDescription', 'Job description 1\nblabla blabla blabla blabla blabla blabla blabla blabla blabla blabla')
    },
    {
      company: 'Shimo',
      period: '2021.10 - 2023.04', 
      tags: 'All-In-One Collaboration, GTD',
      description: t('shimoDescription', 'Job description 2\nblabla blabla blabla blabla blabla blabla blabla blabla blabla blabla')
    },
    {
      company: 'Seiue',
      period: '2021.10 - 2023.04',
      tags: 'All-In-One Collaboration, GTD', 
      description: t('seiueDescription', 'Job description 3\nblabla blabla blabla blabla blabla blabla blabla blabla blabla blabla')
    },
    {
      company: 'Action',
      period: t('actionPeriod', '时间'),
      tags: t('actionTags', '标签'),
      description: t('actionDescription', 'Job description 3\nblabla blabla blabla blabla blabla blabla blabla blabla blabla blabla')
    }
  ];

  // 中文注释: 动态计算页面高度，确保背景覆盖所有内容
  useEffect(() => {
    const calculatePageHeight = () => {
      if (mainContainerRef.current) {
        const containerRect = mainContainerRef.current.getBoundingClientRect();
        // 中文注释: 内容实际高度 + 顶部偏移 + 底部边距72px + 额外缓冲100px
        const contentBasedHeight = containerRect.height + 200 + 72 + 100;
        // 中文注释: 确保至少有一屏高度，但主要以内容为准
        const totalHeight = Math.max(contentBasedHeight, window.innerHeight);
        setPageHeight(`${totalHeight}px`);
      }
    };

    // 中文注释: 初始计算和窗口resize时重新计算，内容变化时也重新计算
    const timeoutId = setTimeout(calculatePageHeight, 100);
    calculatePageHeight();
    window.addEventListener('resize', calculatePageHeight);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculatePageHeight);
    };
  }, [experiences.length, i18n.language]); // 中文注释: 当内容或语言变化时重新计算

  // 中文注释: 监听ESC键关闭弹窗
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen]);

  // 中文注释: 监听点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isLanguageDropdownOpen && !e.target.closest('.language-dropdown')) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [isLanguageDropdownOpen]);

  return (
    <div className="w-full bg-white relative" style={{ paddingBottom: '72px', minHeight: pageHeight }}>
      {/* 中文注释: 背景渐变层 - 动态计算高度确保完全覆盖 */}
      <div 
        className="absolute top-0 left-0 w-full opacity-40 z-0"
        style={{
          height: pageHeight,
          background: `radial-gradient(ellipse 1200px 800px at 1384px 617px, 
            rgba(255,245,219,1) 0%, 
            rgba(255,253,237,1) 21.327%, 
            rgba(254,255,243,1) 61.062%, 
            rgba(248,255,236,1) 79.75%, 
            rgba(247,255,232,1) 100%)`
        }}
      />

      {/* 中文注释: 装饰性背景元素 */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none" style={{ height: pageHeight }}>
        {/* 右上角圆形 */}
        <div 
          className="absolute w-[483px] h-[483px] -top-32 right-[-100px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,245,219,0.3) 0%, rgba(255,245,219,0.1) 70%, transparent 100%)'
          }}
        />
        {/* 左下角大圆形 */}
        <div 
          className="absolute w-[1505px] h-[1505px] top-[1000px] -left-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(248,255,236,0.2) 0%, rgba(248,255,236,0.05) 50%, transparent 100%)'
          }}
        />
        {/* 左侧小圆形 */}
        <div 
          className="absolute w-[333px] h-[994px] -top-40 -left-24 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(255,253,237,0.15) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* 中文注释: 导航栏 - 移动端适配 */}
      <nav className="absolute top-0 left-0 w-full h-[148px] backdrop-blur-[2px] bg-white/10 z-20">
        <div className="absolute top-[60px] right-4 sm:right-[112px]">
          <div className="relative language-dropdown">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 text-[#323335] font-semibold text-sm sm:text-base leading-5 rounded-lg transition-all duration-200 hover:bg-white/20"
            >
              {i18n.language === 'zh' ? '中文' : 'English'}
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isLanguageDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 backdrop-blur-sm border border-gray-200/50 rounded-lg shadow-lg z-50 min-w-[100px] py-1" style={{ backgroundColor: '#FDFCF3' }}>
                <button 
                  onClick={() => changeLanguage('en')} 
                  className="block px-4 py-2 mx-1 text-left text-sm font-medium text-gray-700 transition-colors duration-150"
                  style={{ '&:hover': { backgroundColor: '#EEEDE0' }, width: 'calc(100% - 8px)' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#EEEDE0';
                    e.target.style.borderRadius = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderRadius = '8px';
                  }}
                >
                  English
                </button>
                <button 
                  onClick={() => changeLanguage('zh')} 
                  className="block px-4 py-2 mx-1 text-left text-sm font-medium text-gray-700 transition-colors duration-150"
                  style={{ '&:hover': { backgroundColor: '#EEEDE0' }, width: 'calc(100% - 8px)' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#EEEDE0';
                    e.target.style.borderRadius = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderRadius = '8px';
                  }}
                >
                  中文
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 中文注释: 整个内容容器 - 包含标题和所有内容，整体居中，支持移动端响应式 */}
      <div ref={mainContainerRef} className="absolute top-[200px] left-1/2 transform -translate-x-1/2 w-[720px] max-w-[90vw] px-4 sm:px-0 z-10">
        {/* 中文注释: 主标题 - 响应式字体大小，移动端适配 */}
        <h1 
          className="text-[28px] sm:text-[36px] font-bold text-[#323335] leading-none tracking-[-0.72px] whitespace-nowrap"
          style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          Hi, I'm Lanaya Shi
        </h1>

        {/* 中文注释: 主要内容区域 - 在容器内，与标题在同一个容器中 */}
        <main className="mt-[204px]">
        <div className="flex flex-col gap-[100px]">
          
          {/* 中文注释: About 部分 */}
          <section className="flex flex-col gap-14">
            <h2 
              className="text-[24px] font-bold text-[#477c4d] leading-none"
              style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              About
            </h2>
            <div 
              className="text-[18px] font-medium leading-7"
              style={{
                fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                background: 'linear-gradient(-78.8471deg, rgb(67, 70, 76) 1.522%, rgb(91, 95, 106) 33.45%, rgb(63, 116, 62) 106.08%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              <p className="mb-3">
                {t('aboutPara1', 'Passionate about self-improvement, enthusiastic about critical thinking and debate, deeply drawn to artistic sensibilities, feminism, and the belief in fluidity. Once idolized geek culture and was a productivity enthusiast.')}
              </p>
              <p className="mb-3">
                {t('aboutPara2', "I'm now experiencing a slower pace of life, observing and rethinking humanity's pursuit of high-speed technology, the fast-paced society, and whether new technologies like AI are primarily addressing the issues of highly skilled individuals, continuing to create wealth for the economic elite, and falling short in assisting ordinary people. I also ponder the potential for technology to reduce class solidification and narrow the wealth gap in the future.")}
              </p>
              <p className="mb-3">
                {t('aboutPara3', 'My core profession is product design for internet products. I love music, especially Jazz hip-hop, Nujabes, FKJ.')}
              </p>
              <p>
                {t('aboutPara4', "I love nature, especially walking in the beautiful nature like JiuzhaiGou and Iceland, which I just traveled a few day's ago. I very like to thinking and reading, listening podcasts, especially about philosophy, thinking, social science.")}
              </p>
            </div>
          </section>

          {/* 中文注释: Experience 和 Project Detail 部分 */}
          <section className="flex flex-col gap-16">
            
            {/* Experience */}
            <div className="flex flex-col gap-14">
              <h2 
                className="text-[24px] font-bold text-[#477c4d] leading-none"
                style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                Experience
              </h2>
              <div className="flex flex-col gap-[60px]">
                {experiences.map((exp, index) => (
                  <div key={index} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1 w-[312px]">
                        <h3 
                          className="text-[20px] font-semibold text-[#323335] leading-none whitespace-nowrap"
                          style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                        >
                          {exp.company}
                        </h3>
                        <p 
                          className="text-[14px] font-medium text-[rgba(50,51,53,0.56)] leading-5 whitespace-nowrap"
                          style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                        >
                          {exp.period}
                        </p>
                      </div>
                      <p 
                        className="text-[14px] font-semibold italic text-[#477c4d] leading-none w-[312px]"
                        style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                      >
                        {exp.tags}
                      </p>
                    </div>
                    <div 
                      className="text-[16px] font-normal text-[rgba(50,51,53,0.85)] leading-[22px] w-full whitespace-pre-line"
                      style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    >
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 中文注释: Project Detail 入口卡片 - 移动端响应式适配 */}
            <div 
              ref={cardRef}
              className="project-card relative w-full max-w-[720px] aspect-[2/1] sm:aspect-auto sm:h-[320px] rounded-lg transition-all duration-300 ease-out cursor-pointer"
              style={{
                background: 'linear-gradient(180deg, #d7e9d4 0%, #a5caa7 75.962%, #7eb184 100%)',
                marginBottom: '72px',
                boxShadow: isHovered
                  ? '0px 8px 32px 0px rgba(0,0,0,0.08), 0px 4px 16px 0px rgba(0,0,0,0.06)'
                  : '0px 4px 24px 0px rgba(0,0,0,0.04), 0px 2px 8px 0px rgba(0,0,0,0.04)'
              }}
              onClick={handleCardClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="overflow-hidden relative w-full h-full rounded-lg">
                
                {/* 中文注释: 标题文案 - 移动端适配 */}
                <div className="absolute left-1/2 top-[32px] sm:top-[42px] transform -translate-x-1/2 w-[280px] sm:w-[336px] px-4 sm:px-0">
                  <p 
                    className="text-[16px] sm:text-[18px] font-semibold italic text-[#4c6b47] text-center leading-none"
                    style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    View the Project Portfolio 👇🏼
                  </p>
                </div>

                {/* 中文注释: 移动端组合图片 - 只在小屏幕显示，确保高度占card的2/3 */}
                <div className="block sm:hidden absolute bottom-0 left-0 w-full h-2/3">
                  <img 
                    src="/card_pictures.png" 
                    alt="Project Portfolio Preview"
                    className="w-full h-full object-cover object-bottom"
                    style={{ 
                      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                      transition: 'transform 300ms ease-out'
                    }}
                  />
                </div>

                {/* 中文注释: 桌面端独立图片组 - 只在大屏幕显示，保持原有动效 */}
                <div className="hidden sm:block">

                {/* 中文注释: 7张项目图片 - 添加hover态位置和角度变化 */}
                {/* 图片1 - Frame 63 - 右上角 */}
                <div className={`absolute flex items-center justify-center transition-all duration-300 ease-out ${
                  isHovered 
                    ? 'left-[492px] top-[228px]' 
                    : 'left-[488px] top-[225px]'
                } w-[203px] h-[153px]`}>
                  <div className={`transform transition-transform duration-300 ease-out ${
                    isHovered 
                      ? 'rotate-[348deg]' 
                      : 'rotate-[350.482deg]'
                  }`}>
                    <div 
                      className="w-[185px] h-[124px] bg-cover bg-center bg-no-repeat rounded-xl border-2 border-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06),0px_2px_6px_0px_rgba(0,0,0,0.08)]"
                      style={{ backgroundImage: `url('${imgFrame63}')` }}
                    />
                  </div>
                </div>

                {/* 图片2 - Frame 62 - 右下角 */}
                <div className={`absolute flex items-center justify-center transition-all duration-300 ease-out ${
                  isHovered 
                    ? 'left-[324px] top-[241px]' 
                    : 'left-[320px] top-[238px]'
                } w-[197px] h-[142px]`}>
                  <div className={`transform transition-transform duration-300 ease-out ${
                    isHovered 
                      ? 'rotate-[8deg]' 
                      : 'rotate-[6deg]'
                  }`}>
                    <div 
                      className="w-[185px] h-[124px] bg-cover bg-center bg-no-repeat rounded-xl border-2 border-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06),0px_2px_6px_0px_rgba(0,0,0,0.08)]"
                      style={{ backgroundImage: `url('${imgFrame62}')` }}
                    />
                  </div>
                </div>

                {/* 图片3 - Frame 64 - 上方中央 */}
                <div className={`absolute flex items-center justify-center transition-all duration-300 ease-out ${
                  isHovered 
                    ? 'left-[468px] top-[100px]' 
                    : 'left-[464px] top-[97px]'
                } w-[207px] h-[159px]`}>
                  <div className={`transform transition-transform duration-300 ease-out ${
                    isHovered 
                      ? 'rotate-[14deg]' 
                      : 'rotate-[12deg]'
                  }`}>
                    <div 
                      className="w-[185px] h-[124px] bg-cover bg-center bg-no-repeat rounded-xl border-2 border-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06),0px_2px_6px_0px_rgba(0,0,0,0.08)]"
                      style={{ backgroundImage: `url('${imgFrame64}')` }}
                    />
                  </div>
                </div>

                {/* 图片4 - Frame 65 - 左下角 */}
                <div className={`absolute flex items-center justify-center transition-all duration-300 ease-out ${
                  isHovered 
                    ? 'left-[-32px] top-[214px]' 
                    : 'left-[-29px] top-[211px]'
                } w-[211px] h-[167px]`}>
                  <div className={`transform transition-transform duration-300 ease-out ${
                    isHovered 
                      ? 'rotate-[342deg]' 
                      : 'rotate-[345.008deg]'
                  }`}>
                    <div 
                      className="w-[185px] h-[124px] bg-cover bg-center bg-no-repeat rounded-xl border-2 border-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06),0px_2px_6px_0px_rgba(0,0,0,0.08)]"
                      style={{ backgroundImage: `url('${imgFrame65}')` }}
                    />
                  </div>
                </div>

                {/* 图片5 - Frame 66 - 左上角 */}
                <div className={`absolute flex items-center justify-center transition-all duration-300 ease-out ${
                  isHovered 
                    ? 'left-[79px] top-[109px]' 
                    : 'left-[76px] top-[106px]'
                } w-[202px] h-[151px]`}>
                  <div className={`transform transition-transform duration-300 ease-out ${
                    isHovered 
                      ? 'rotate-[11deg]' 
                      : 'rotate-[8.902deg]'
                  }`}>
                    <div 
                      className="w-[185px] h-[124px] bg-cover bg-center bg-no-repeat rounded-xl border-2 border-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06),0px_2px_6px_0px_rgba(0,0,0,0.08)]"
                      style={{ backgroundImage: `url('${imgFrame66}')` }}
                    />
                  </div>
                </div>

                {/* 图片6 - Frame 68 - 中央偏上 */}
                <div className={`absolute flex items-center justify-center transition-all duration-300 ease-out ${
                  isHovered 
                    ? 'left-[284px] top-[117px]' 
                    : 'left-[281px] top-[114px]'
                } w-[192px] h-[134px]`}>
                  <div className={`transform transition-transform duration-300 ease-out ${
                    isHovered 
                      ? 'rotate-[354deg]' 
                      : 'rotate-[356.71deg]'
                  }`}>
                    <div 
                      className="w-[185px] h-[124px] bg-cover bg-center bg-no-repeat rounded-xl border-2 border-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06),0px_2px_6px_0px_rgba(0,0,0,0.08)]"
                      style={{ backgroundImage: `url('${imgFrame68}')` }}
                    />
                  </div>
                </div>

                {/* 图片7 - Frame 67 - 中央偏下 */}
                <div className={`absolute flex items-center justify-center transition-all duration-300 ease-out ${
                  isHovered 
                    ? 'left-[151px] top-[215px]' 
                    : 'left-[148px] top-[212px]'
                } w-[201px] h-[148px]`}>
                  <div className={`transform transition-transform duration-300 ease-out ${
                    isHovered 
                      ? 'rotate-[349deg]' 
                      : 'rotate-[352deg]'
                  }`}>
                    <div 
                      className="w-[185px] h-[124px] bg-cover bg-center bg-no-repeat rounded-xl border-2 border-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06),0px_2px_6px_0px_rgba(0,0,0,0.08)]"
                      style={{ backgroundImage: `url('${imgFrame67}')` }}
                    />
                  </div>
                </div>
                </div>
              </div>
              
              {/* 卡片边框 */}
              <div className="absolute inset-0 border border-[rgba(0,0,0,0.06)] rounded-lg pointer-events-none" />
            </div>
          </section>
        </div>
      </main>
      </div>

      {/* 中文注释: 密码输入弹窗 - 移动端响应式适配 */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={(e) => {
            // 中文注释: 点击遮罩层关闭弹窗
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div 
            className="relative w-full max-w-[640px] h-[380px] sm:h-[412px] rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #F0FAE7 0%, #DCE8DD 100%)'
            }}
          >
            {/* 中文注释: 背景图片层 - 移动端响应式缩放 */}
            <img 
              src="/background.png" 
              alt="Modal background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                zIndex: 1,
                transform: 'scale(1.1)',
                transformOrigin: 'center center'
              }}
              onLoad={() => console.log('背景图片加载成功')}
              onError={() => console.log('背景图片加载失败')}
            />

            {/* 中文注释: 关闭按钮 */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCloseModal();
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#4c6b47] hover:bg-white/20 rounded-full transition-all duration-200"
              style={{ zIndex: 50 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 中文注释: 标题 - 移动端适配，确保在背景图片上方，左右间距24px，移除重复padding */}
            <div className="absolute top-[32px] sm:top-[42px] left-1/2 transform -translate-x-1/2 w-full max-w-[calc(100%-48px)]" style={{ zIndex: 50 }}>
              <h2 
                className="text-[15px] sm:text-[16px] font-semibold text-[#4c6b47] text-center leading-tight sm:leading-normal"
                style={{ 
                  fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                  lineHeight: '1.3'
                }}
              >
                {t('modalTitle', 'Enter Password to Access Full Project Portfolio')}
              </h2>
            </div>

            {/* 中文注释: 密码输入区域 - 移动端适配位置，确保在背景图片上方 */}
            <div className="absolute top-[180px] sm:top-[244px] left-1/2 transform -translate-x-1/2 px-6" style={{ zIndex: 50 }}>
              {/* 密码输入区域 */}
              {passwordState === 'input' && (
                <div className="w-full max-w-[296px]">
                  <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
                    {/* 密码输入框 - 严格按照新的样式要求 */}
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('passwordPlaceholder', 'Password')}
                        className="w-full px-4 py-3 pr-14 sm:pr-12 rounded-lg focus:outline-none text-[15px] sm:text-[14px] font-medium text-[#323335] placeholder-[rgba(50,51,53,0.56)] transition-all duration-200"
                        style={{ 
                          fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                          height: '48px', // 移动端稍大一些
                          backgroundColor: 'rgba(255, 255, 255, 0.72)', // 填充 #FFFFFF 72%
                          border: '1px solid #ffffff', // active态边框
                          boxShadow: 'none'
                        }}
                        onFocus={(e) => {
                          // active态：边框显示，填充保持
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.72)';
                          e.target.style.border = '1px solid #ffffff';
                          e.target.style.boxShadow = 'none';
                        }}
                        onBlur={(e) => {
                          // 失焦态：边框不显示，只显示填充
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.72)';
                          e.target.style.border = '1px solid transparent';
                          e.target.style.boxShadow = 'none';
                        }}
                        autoFocus
                      />
                      {/* 提交按钮 - 移动端增大尺寸 */}
                      <button 
                        type="submit" 
                        disabled={!password.trim()}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 sm:w-8 sm:h-8 rounded-md transition-all duration-200 flex items-center justify-center"
                        style={{
                          backgroundColor: password.trim() ? '#C3D0C0' : 'rgba(195, 208, 192, 0.32)', // 可用态或禁用态(32%透明度)
                          border: password.trim() ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.32)', // 边框透明度
                          color: password.trim() ? '#4c6b47' : 'rgba(76, 107, 71, 0.32)', // 图标颜色
                          cursor: password.trim() ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* 错误信息 */}
                    {error && (
                      <p 
                        className="text-[13px] sm:text-[12px] text-[#ec221f] font-medium leading-none text-center"
                        style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                      >
                        {error}
                      </p>
                    )}
                  </form>

                  {/* 获取密码提示信息 */}
                  <div className="flex flex-col gap-3 items-center mt-6">
                    <p 
                      className="text-[13px] sm:text-[12px] text-[rgba(50,51,53,0.56)] text-center leading-none font-normal"
                      style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    >
                      {t('passwordHint1', 'No password? Please contact me:')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                      <p 
                        className="text-[13px] sm:text-[12px] text-[#4c6b47] font-medium italic text-center whitespace-nowrap"
                        style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                      >
                        {t('wechatContact', 'Wechat: s_wenxin')}
                      </p>
                      <p 
                        className="text-[13px] sm:text-[12px] text-[#4c6b47] font-medium italic text-center whitespace-nowrap"
                        style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                      >
                        {t('emailContact', 'Email: lanayaswx@outlook.com')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 密码正确状态 */}
              {passwordState === 'success' && (
                <div className="w-full max-w-[400px]">
                  <p 
                    className="text-[16px] sm:text-[18px] font-semibold text-[#4c6b47] text-center leading-relaxed"
                    style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    {t('passwordSuccessText', 'Password entered correctly, new page opened 🙌🏼')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}