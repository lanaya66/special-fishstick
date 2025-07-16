import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import ProjectList from '../components/ProjectList';
import Navigation from '../components/Navigation';

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
  const router = useRouter();

  // 中文注释: 移除 pageHeight 状态，让内容自然撑开页面高度
  const [isSmallAbout, setIsSmallAbout] = useState(false); // 中文注释: 检测About部分是否需要竖向布局
  const [isMobile, setIsMobile] = useState(false); // 中文注释: 检测是否为移动端
  const mainContainerRef = useRef(null); // 中文注释: 主容器ref用于计算高度
  const aboutSectionRef = useRef(null); // 中文注释: About部分ref用于检测宽度

  // 中文注释: 初始化语言设置 - 优先使用URL参数，然后localStorage，最后默认en
  useEffect(() => {
    const urlLang = router.query.lang;
    const savedLanguage = urlLang || localStorage.getItem('i18nextLng') || 'en';
    
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
    
    // 中文注释: 如果URL没有lang参数，添加它
    if (router.isReady && !router.query.lang && savedLanguage) {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, lang: savedLanguage }
      }, undefined, { shallow: true });
    }
  }, [router.isReady, router.query.lang]);

  // 中文注释: 检测About部分宽度，决定是否使用竖向布局
  useEffect(() => {
    const checkAboutWidth = () => {
      if (aboutSectionRef.current) {
        const aboutWidth = aboutSectionRef.current.offsetWidth;
        setIsSmallAbout(aboutWidth <= 600);
      }
    };

    checkAboutWidth();
    window.addEventListener('resize', checkAboutWidth);

    return () => {
      window.removeEventListener('resize', checkAboutWidth);
    };
  }, []);

  // 中文注释: 使用 useMemo 优化 experiences 数组，避免无限重新渲染
  const experiences = React.useMemo(() => [
    {
      company: 'Zoom',
      period: '2023.04 - 2024.09',
      tags: i18n.language === 'zh' ? 'AI，新型文档，协作工具' : 'AI, Doc editor, Collaborative tool',
      description: t('zoomDescription', 'Job description 1\nblabla blabla blabla blabla blabla blabla blabla blabla blabla blabla')
    },
    {
      company: i18n.language === 'zh' ? '石墨文档' : 'Shimo',
      period: '2021.10 - 2023.04', 
      tags: i18n.language === 'zh' ? 'All-In-One 团队协作，知识管理，个人生产力' : 'All-In-One Collaboration, Knowledge management, GTD',
      description: t('shimoDescription', 'Job description 2\nblabla blabla blabla blabla blabla blabla blabla blabla blabla blabla')
    },
    {
      company: i18n.language === 'zh' ? '悦活教育' : 'Seiue',
      period: '2018.03 - 2021.09',
      tags: i18n.language === 'zh' ? '创新教育，个人生产力，流程中台，设计系统' : 'Innovative education, Productivity, Workflow Engine, Design System',
      description: t('seiueDescription', 'Job description 3\nblabla blabla blabla blabla blabla blabla blabla blabla blabla blabla')
    },
    {
      company: i18n.language === 'zh' ? '派格斯文化传媒' : 'O.P.E',
      period: '2017.08-2018.03',
      tags: i18n.language === 'zh' ? '视频制作交易' : 'Video Creator Platform',
      description: t('actionDescription', 'Job description 4\nblabla blabla blabla blabla blabla blabla blabla blabla blabla blabla')
    }
  ], [i18n.language, t]); // 中文注释: 依赖于语言和翻译函数

  // 中文注释: 检测移动端设备
  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 768);
      }
    };

    checkIsMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkIsMobile);
      return () => window.removeEventListener('resize', checkIsMobile);
    }
  }, []);

  // 中文注释: 移除复杂的页面高度计算，让内容自然撑开页面，简化布局逻辑

  // 中文注释: 背景现在直接在 JSX 中实现，包含线性渐变和 noise 效果

  return (
    <div className="w-full bg-white relative" style={{ paddingBottom: '200px', minHeight: '100vh' }}>
      {/* 中文注释: 整个背景组 - 包含渐变背景和装饰元素，统一 24% 透明度 */}
      <div 
        className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none z-0" 
        style={{
          height: '100%',
          minHeight: '100vh',
          opacity: 0.24 // 中文注释: 使用内联样式设置24%透明度
        }}
      >
        {/* 中文注释: 背景渐变层 - 从左上角 #F7FFE8 到右下角 #FFF5DB */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #F7FFE8 0%, #FFF5DB 100%)'
          }}
        />
        {/* 中文注释: 左侧竖椭圆 - #C9F6FF，blur 500 */}
        <div 
          className="absolute"
          style={{
            width: '414px',
            height: '1236px',
            left: '-182px',
            top: '57px',
            background: '#C9F6FF',
            borderRadius: '50%',
            filter: 'blur(500px)'
          }}
        />
        
        {/* 中文注释: 右上角圆 - #FFE8A0，blur 600 */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '697px',
            height: '697px',
            left: '1031px',
            top: '-235px',
            background: '#FFE8A0',
            filter: 'blur(600px)'
          }}
        />
        
        {/* 中文注释: y=1247 位置三角形 - 左侧高 1129 右侧高 0，blur 600，#C1E1FF 到 #C1C1FF 渐变，70% 不透明度 */}
        <svg 
          className="absolute"
          style={{
            width: '100%',
            height: '1129px',
            left: '0',
            top: '1247px',
            filter: 'blur(600px)',
            opacity: 0.7 // 中文注释: 三角形额外的70%不透明度
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="triangleGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C1E1FF" />
              <stop offset="100%" stopColor="#C1C1FF" />
            </linearGradient>
          </defs>
          <polygon 
            points="0,0 0,100 100,100" 
            fill="url(#triangleGradient1)"
          />
        </svg>
        
        {/* 中文注释: y=2540 位置三角形 - 左侧高 0 右侧高 2038，blur 320，#CDE8FF，70% 不透明度 */}
        <svg 
          className="absolute"
          style={{
            width: '100%',
            height: '2038px',
            left: '0',
            top: '2540px',
            filter: 'blur(320px)',
            opacity: 0.7 // 中文注释: 三角形额外的70%不透明度
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon 
            points="0,100 100,0 100,100" 
            fill="#CDE8FF"
          />
        </svg>
      </div>

      {/* 中文注释: 统一导航栏 */}
      <Navigation showProjectDropdown={false} />

      {/* 中文注释: 整个内容容器 - 包含标题和所有内容，按新的900px最大宽度和响应式间距 */}
      <div 
        ref={mainContainerRef} 
        className="relative z-10"
        style={{
          width: '100%',  // 移除固定宽度限制
          paddingLeft: 'max(24px, calc((100vw - 900px) / 2))',
          paddingRight: 'max(24px, calc((100vw - 900px) / 2))',
          paddingTop: 'clamp(160px, 200px, 220px)' // 148px导航栏高度 + 52px间距，mobile下160px
        }}
      >
        {/* 中文注释: 主标题 - 响应式字体大小，移动端适配 */}
        <h1 
          className="text-[28px] sm:text-[36px] font-bold text-[#323335] leading-none tracking-[-0.72px] whitespace-nowrap"
          style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          Hi, I'm Lanaya Shi
        </h1>

        {/* 中文注释: 主要内容区域 - 在容器内，与标题在同一个容器中，移动端160px间距 */}
        <main className="mt-[160px] lg:mt-[204px]">
        <div className="flex flex-col gap-[116px] lg:gap-[160px]">
            
            {/* 中文注释: About 部分 - 左右布局：左侧文字，右侧图片+联系方式 */}
            <section 
              ref={aboutSectionRef}
              className="flex flex-col gap-14"
            >
              <h2 
                className="text-[24px] font-semibold text-[#323335] leading-none"
              style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              About
            </h2>
              <div 
                className={`flex ${isSmallAbout ? 'flex-col gap-12' : 'flex-row gap-[100px]'}`}
              >
                                {/* 图片+联系方式部分 - 小屏时显示在上方 */}
                <div 
                  className={`flex flex-col items-center ${
                    isSmallAbout 
                      ? 'w-full order-1 gap-8' 
                      : 'w-[250px] items-start order-2 gap-8'
                  }`}
                >
                  {/* 个人头像/图片 */}
                  <div 
                    className={`${
                      isSmallAbout 
                        ? 'w-full aspect-[3/2] rounded-2xl' 
                        : 'w-[250px] h-[250px] rounded-2xl'
                    } bg-white border-2 border-white overflow-hidden`}
                    style={{
                      boxShadow: '0px 6px 16px 0px rgba(0, 0, 0, 0.06), 0px 2px 6px 0px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    {/* 真实头像图片 */}
                    <img 
                      src="/lanaya profile.JPG"
                      alt={i18n.language === 'zh' ? 'Lanaya 个人照片' : 'Lanaya Profile Photo'}
                      className={`w-full h-full ${isSmallAbout ? 'object-cover' : 'object-cover'}`}
                    />
                  </div>
                  
                  {/* 联系方式 - 移除图标和标题 */}
                  <div 
                    className="flex-1 w-full text-left"
                    style={{
                      color: 'rgba(50, 51, 53, 0.85)',
                      fontFamily: '"Source Han Sans SC", "Noto Sans CJK SC", -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: 'normal'
                    }}
                  >
                    <div className="space-y-3">
                      <div>Wechat: s_wenxin</div>
                      <div>Phone: 18612510105</div>
                      <div>Email: lanayaswx@outlook.com</div>
                    </div>
                  </div>
                </div>

                {/* 文字部分 - 小屏时显示在下方 */}
                <div 
                  className={`${isSmallAbout ? 'w-full order-2' : 'w-[550px] order-1'}`}
                >
            <div 
              className="text-[18px] font-medium"
              style={{
                fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                background: 'linear-gradient(-78.8471deg, rgb(67, 70, 76) 1.522%, rgb(91, 95, 106) 33.45%, rgb(63, 116, 62) 106.08%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '32px'  // 更新 About 部分行高为 32px
              }}
            >
                    <p className="mb-4">
                      {t('aboutPara1', 'Product design is not just my profession but also a significant way I experience focus.')}
                    </p>
                    <p className="mb-4">
                      {t('aboutPara2', 'In my past work, I\'ve sought elegant solutions within complex systems, balancing clarity and familiarity with simplicity and efficiency in highly detailed tools, aiming to reduce friction for individual workers in an era of information dispersion.')}
                    </p>
                    <p className="mb-4">
                      {t('aboutPara3', 'I used to be a productivity enthusiast, drawn to various automation technologies and products that enhance efficiency and cut unnecessary time waste. In recent years, my AI product work has focused more on issues like "effortless automation versus human control" and "traditional interfaces versus new interaction languages."')}
                    </p>
                    <p className="mb-4">
                      {t('aboutPara4', 'I have a passion for nature, share my home with two cats, and occasionally indulge in reading and podcasts during my leisure time.')}
                    </p>
                    <p className="mb-4">
                      {t('aboutPara5', 'Music is another joy; I enjoy Jazz hip-hop, City Pop, and artists like Nujabes, FKJ, and Honne.')}
                    </p>
                    <p className="mb-4">
                      {t('aboutPara6', 'After a long period of intense work leading to the launch of my previous product, I decided to take a break from years of busyness to rediscover the observation of everyday life and savor the slowed-down time. Over the past few months, I\'ve gone hiking in places I\'ve always wanted to visit, practiced dancing to express myself in diverse ways, and started learning programming to enhance my ability to bring ideas to life and increase certainty in Vibe coding.')}
              </p>

                  </div>
            </div>
              </div>
            </section>
            
              {/* 中文注释: Experience 部分 */}
            <section className="flex flex-col gap-14">
              <h2 
                className="text-[24px] font-semibold text-[#323335] leading-none"
                style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                Experience
              </h2>
              <div className="flex flex-col gap-[60px]">
                {experiences.map((exp, index) => (
                  <div key={index} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                        <h3 
                            className="text-[20px] font-semibold text-[#323335] leading-none"
                          style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                        >
                          {exp.company}
                        </h3>
                        <p 
                            className="text-[14px] font-medium text-[rgba(50,51,53,0.56)] leading-5"
                          style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                        >
                          {exp.period}
                        </p>
                      </div>
                      <p 
                          className="text-[14px] font-semibold text-[#477c4d] leading-[1.5]"
                        style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                      >
                        {exp.tags}
                      </p>
                    </div>
                    <div 
                        className="text-[16px] font-normal text-[rgba(50,51,53,0.85)] experience-description"
                      style={{ 
                        fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                        lineHeight: '26px'  // 更新 Experience 部分行高为 26px
                      }}
                      dangerouslySetInnerHTML={{
                        __html: exp.description
                          .split('\n\n')
                          .map(paragraph => {
                            // 检查是否是数字列表段落
                            if (paragraph.includes('\n1. ') || paragraph.includes('\n2. ') || paragraph.includes('\n3. ')) {
                              const lines = paragraph.split('\n');
                              const firstLine = lines[0];
                              const listItems = lines.slice(1).filter(line => /^\d+\./.test(line.trim()));
                              
                              if (listItems.length > 0) {
                                const listHTML = listItems.map(item => 
                                  `<li>${item.replace(/^\d+\.\s*/, '')}</li>`
                                ).join('');
                                
                                return firstLine ? `<p>${firstLine}</p><ol>${listHTML}</ol>` : `<ol>${listHTML}</ol>`;
                              }
                            }
                            
                            // 检查是否是项目符号列表段落
                            if (paragraph.includes('\n• ')) {
                              const lines = paragraph.split('\n');
                              const firstLine = lines[0];
                              const listItems = lines.slice(1).filter(line => line.trim().startsWith('• '));
                              
                              if (listItems.length > 0) {
                                const listHTML = listItems.map(item => 
                                  `<li>${item.replace(/^•\s*/, '')}</li>`
                                ).join('');
                                
                                return firstLine ? `<p>${firstLine}</p><ul>${listHTML}</ul>` : `<ul>${listHTML}</ul>`;
                              }
                            }
                            
                            // 普通段落
                            return `<p>${paragraph}</p>`;
                          })
                          .join('')
                      }}
                    />
                  </div>
                ))}
            </div>
          </section>

            {/* 中文注释: 项目列表部分 */}
            <section className="flex flex-col gap-14" style={{ marginBottom: '72px' }}>
              <h2 
                className="text-[24px] font-semibold text-[#323335] leading-none"
                style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                Projects
              </h2>
              <ProjectList />
            </section>
          </div>
        </main>
        </div>
    </div>
  );
}