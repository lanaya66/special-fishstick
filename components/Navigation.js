import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import ProjectMenuItem from './ProjectMenuItem'; // 导入新组件

/**
 * 统一导航栏组件
 * 用于主页和详情页，实现container-based responsive design
 */
export default function Navigation({ 
  allProjects = [], 
  currentProject = null, 
  showProjectDropdown = false 
}) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // 判断是否为主页
  const isHomePage = router.pathname === '/';

  // 检查是否为移动端视图
  useEffect(() => {
    const checkMobileView = () => {
      // 包含常见移动设备范围：iPhone SE到Samsung Galaxy S20 Ultra
      // iPhone SE (375px), iPhone 12 Pro (390px), iPhone 14 Pro Max (430px), Samsung Galaxy S20 Ultra (412px)
      // 设定为 <= 480px 来覆盖所有常见移动设备
      setIsMobileView(window.innerWidth <= 480);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // 语言切换函数
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    
    router.push({
      pathname: router.pathname,
      query: { ...router.query, lang: lng }
    }, undefined, { shallow: false });
    
    setIsLanguageDropdownOpen(false);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.project-dropdown') && !e.target.closest('.mobile-bottom-sheet-content')) {
        setIsProjectDropdownOpen(false);
      }
      if (!e.target.closest('.language-dropdown') && !e.target.closest('.mobile-bottom-sheet-content')) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // 项目切换菜单排序函数
  const sortProjectsByOrder = (projects) => {
    const order = [
      'zoom-docs-contextual-ai-tools',
      'zoom-docs-ask-ai-companion',
      'zoom-docs-ai-meeting-doc', 
      'zoom-docs-page-editor',
      'light-mainsite',
      'light-gtd',
      'chalk-30'
    ];
    
    return projects.sort((a, b) => {
      const aIndex = order.indexOf(a.slug);
      const bIndex = order.indexOf(b.slug);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  };

  const sortedProjects = sortProjectsByOrder(allProjects);

  return (
    <>
      {/* 内容遮罩（仅详情页） */}
      {!isHomePage && <div className="navigation-mask" />}
      

      
      {/* 导航栏 */}
      <nav 
        className={`navigation-nav fixed top-0 left-0 right-0 ${!isHomePage ? 'with-blur' : ''}`}
      >
        <div 
          className="navigation-container mx-auto max-w-screen-xl flex items-center"
          style={{ maxWidth: '1200px' }}
        >
          {/* 左侧 - Home按钮（仅在详情页显示） */}
          <div className="nav-left flex items-center">
            {showProjectDropdown ? (
              isMobileView ? (
                // 中文注释: 移动端 - 房子图标按钮
                <button
                  onClick={() => {
                    localStorage.setItem('i18nextLng', i18n.language);
                    window.location.href = `/?lang=${i18n.language}`;
                  }}
                  className="flex items-center justify-center w-10 h-8 text-[rgba(50,51,53,0.85)] hover:bg-[rgba(50,51,53,0.06)] rounded-lg transition-all duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                </button>
              ) : (
                // 中文注释: 桌面端 - 文字按钮
                <Link 
                  href={`/?lang=${i18n.language}`}
                  className="flex items-center gap-2 px-2 py-1 text-[rgba(50,51,53,0.85)] font-semibold text-[16px] leading-5 hover:bg-[rgba(50,51,53,0.06)] rounded-lg transition-all duration-200"
                  style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  onClick={() => {
                    localStorage.setItem('i18nextLng', i18n.language);
                  }}
                >
                  <span>Home</span>
                </Link>
              )
            ) : (
              <div></div>  // 主页时为空，保持布局平衡
            )}
          </div>

          {/* 中间区域 - 移动端时项目切换居中，桌面端时留空但保持60px最小间距 */}
          <div className="nav-center flex items-center justify-center flex-1">
            {/* 移动端项目切换（居中显示） */}
            {isMobileView && showProjectDropdown && currentProject && (
              <div className="relative project-dropdown mobile-project-wrapper">
                <button
                  onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                  className="project-button flex items-center gap-1 px-2 pr-0.5 py-1 text-[rgba(50,51,53,0.85)] font-semibold text-[16px] leading-5 hover:bg-[rgba(50,51,53,0.06)] rounded-lg transition-all duration-200"
                  style={{ 
                    fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                    minWidth: 0
                  }}
                >
                  <span 
                    className="project-name truncate mobile-project-name"
                    style={{ minWidth: 0 }}
                  >
                    {currentProject.name}
                  </span>
                  <svg 
                    className={`switcher-arrow w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isProjectDropdownOpen ? 'scale-y-[-1]' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* 右侧组 - 项目切换（桌面端）+ 语言切换 */}
          <div className="nav-right flex items-center justify-end">
            {/* 桌面端项目切换下拉菜单 */}
            {!isMobileView && showProjectDropdown && currentProject && (
              <div className="relative project-dropdown">
                <button
                  onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                  className="project-button flex items-center gap-1 text-[rgba(50,51,53,0.85)] font-semibold text-[16px] leading-5 hover:bg-[rgba(50,51,53,0.06)] rounded-lg transition-all duration-200"
                  style={{ 
                    fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                    minWidth: 0,
                    paddingLeft: '8px',
                    paddingRight: '4px',
                    paddingTop: '4px',
                    paddingBottom: '4px'
                  }}
                >
                  <span 
                    className="project-name truncate desktop-project-name"
                    style={{ minWidth: 0 }}
                  >
                    {currentProject.name}
                  </span>
                  <svg 
                    className={`switcher-arrow w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isProjectDropdownOpen ? 'scale-y-[-1]' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* 桌面端项目菜单 - 右对齐定位 */}
                {isProjectDropdownOpen && (
                  <div className="project-menu-container absolute top-full right-0 mt-2 z-50">
                    <div className="project-menu-scrollable">
                      {sortedProjects.map((proj, index) => (
                        <div key={proj.slug} className={index > 0 ? "mt-2" : ""}>
                          <ProjectMenuItem 
                            project={proj}
                            isSelected={proj.slug === currentProject.slug}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* 语言切换 */}
            <div className="relative language-dropdown" style={{ width: isMobileView ? '40px' : '92px' }}>
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className={`language-button flex items-center gap-1 text-[rgba(50,51,53,0.85)] font-semibold text-[16px] leading-5 hover:bg-[rgba(50,51,53,0.06)] rounded-lg transition-all duration-200 ${isMobileView ? 'justify-center w-10 h-8' : 'justify-end'}`}
                style={{ 
                  fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                  paddingLeft: isMobileView ? '0' : '8px',
                  paddingRight: isMobileView ? '0' : '4px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  textAlign: isMobileView ? 'center' : 'right',
                  marginLeft: 'auto'
                }}
              >
                {isMobileView ? (
                  // 中文注释: 移动端 - 地球图标
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                ) : (
                  // 中文注释: 桌面端 - 文字 + 箭头
                  <>
                    <span style={{ marginLeft: 'auto' }}>{i18n.language === 'zh' ? '中文' : 'English'}</span>
                    <svg 
                      className={`switcher-arrow w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isLanguageDropdownOpen ? 'scale-y-[-1]' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
              
              {/* 桌面端语言菜单 */}
              {isLanguageDropdownOpen && !isMobileView && (
                <div className="language-menu-container absolute top-full right-0 mt-2 z-50">
                  <div className="flex flex-col">
                    <button 
                      onClick={() => changeLanguage('en')} 
                      className={`language-item ${i18n.language === 'en' ? 'selected' : ''}`}
                    >
                      English
                    </button>
                    <button 
                      onClick={() => changeLanguage('zh')} 
                      className={`language-item ${i18n.language === 'zh' ? 'selected' : ''}`}
                    >
                      中文
                    </button>
                  </div>
                </div>
              )}
              

            </div>
          </div>
        </div>
      </nav>

      {/* 移动端底部弹出菜单 - 项目切换 */}
      {isMobileView && isProjectDropdownOpen && (
        <div className="mobile-bottom-sheet fixed inset-0 z-50 flex items-end">
          {/* 点击遮罩层关闭弹窗 */}
          <div 
            className="mobile-bottom-sheet-overlay absolute inset-0 bg-black bg-opacity-20"
            onClick={() => setIsProjectDropdownOpen(false)}
          />
          <div className="mobile-bottom-sheet-content w-full bg-white rounded-t-3xl max-h-[70vh] relative z-10 flex flex-col">
            <div className="mobile-bottom-sheet-header p-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto"></div>
            </div>
            <div className="mobile-bottom-sheet-body px-4 pb-4 overflow-y-auto flex-1">
              {sortedProjects.map((proj, index) => (
                <div key={proj.slug} className={index > 0 ? "mt-2" : ""}>
                  <div className="mobile-project-item">
                    <ProjectMenuItem 
                      project={proj}
                      isSelected={proj.slug === currentProject.slug}
                      forceDesktopStyle={true}
                      mobileFullWidth={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 移动端底部弹出菜单 - 语言切换 */}
      {isMobileView && isLanguageDropdownOpen && (
        <div className="mobile-bottom-sheet fixed inset-0 z-50 flex items-end">
          {/* 点击遮罩层关闭弹窗 */}
          <div 
            className="mobile-bottom-sheet-overlay absolute inset-0 bg-black bg-opacity-20"
            onClick={() => setIsLanguageDropdownOpen(false)}
          />
          <div className="mobile-bottom-sheet-content w-full bg-white rounded-t-3xl max-h-[70vh] relative z-10 flex flex-col">
            <div className="mobile-bottom-sheet-header p-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto"></div>
            </div>
            <div className="mobile-bottom-sheet-body px-4 pb-4 overflow-y-auto flex-1">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => changeLanguage('en')} 
                  className={`language-item mobile-language-item ${i18n.language === 'en' ? 'selected' : ''}`}
                >
                  English
                </button>
                <button 
                  onClick={() => changeLanguage('zh')} 
                  className={`language-item mobile-language-item ${i18n.language === 'zh' ? 'selected' : ''}`}
                >
                  中文
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 样式定义 */}
      <style jsx>{`
        /* --- Base Styles (Mobile First) --- */
        .navigation-mask {
          height: 60px; /* Mobile height */
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 80%, rgba(255, 255, 255, 0) 100%);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 40;
        }
        
        .navigation-nav, .navigation-container {
          height: 60px; /* Mobile height */
        }
        
        .navigation-nav {
          z-index: 50;
        }
        
        .navigation-nav.with-blur {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .navigation-container {
          padding-left: 16px;
          padding-right: 16px;
        }

        /* 移动端底部弹出菜单样式 */
        .mobile-bottom-sheet {
          /* 移除动画，直接显示 */
        }

        .mobile-bottom-sheet-content {
          box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.1);
          /* 添加内容动画，只对内容区域进行滑入动画 */
          animation: slideUpContent 0.3s ease-out;
        }

        .mobile-bottom-sheet-overlay {
          /* 蒙层直接显示，无动画 */
        }

        @keyframes slideUpContent {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        /* 移动端布局：包含常见移动设备范围 */
        @media (max-width: 480px) {
          .nav-left,
          .nav-right {
            flex-shrink: 0;
          }
          
          /* 移动端Home按钮和语言切换按钮固定宽度40px */
          .nav-left button,
          .language-button {
            width: 40px !important;
            height: 32px !important;
            justify-content: center !important;
          }
          
          .nav-center {
            flex: 1;
            margin: 0 16px; /* 左右各16px间距 */
            min-width: 0; /* 允许收缩 */
          }
          
          .mobile-project-wrapper {
            width: 100%;
            max-width: 100%;
            min-width: 0;
          }
          
          .project-button {
            width: 100%;
            max-width: 100%;
            justify-content: center;
            min-width: 0;
          }
          
          .mobile-project-name {
            /* 精确计算可用宽度：屏幕宽度 - 左侧home按钮(40px) - 右侧语言按钮(40px) - 左右边距(16px*2) - 左右间距(16px*2) */
            max-width: calc(100vw - 144px); /* 40px + 40px + 32px + 32px = 144px */
            flex: 1;
            text-align: center;
            min-width: 0;
          }
          
          /* 移动端移除所有按钮的hover效果 */
          .project-button:hover,
          .language-button:hover,
          .nav-left button:hover {
            background: transparent !important;
          }
          
          /* 移动端项目菜单项适配 */
          .mobile-project-item {
            width: 100%; /* 占满容器宽度，容器已有16px padding */
            max-width: 100%;
            /* 移除overflow: hidden避免边框被切割 */
            /* 添加内边距确保描边完整显示 */
            padding: 2px;
            margin: -2px;
          }
          
          .mobile-project-item .menu-item {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .mobile-project-item .menu-item.mobile {
            width: 100% !important;
            max-width: 100% !important;
            height: 88px; /* 保持移动端高度 */
          }
          
          .mobile-project-item .menu-item.desktop {
            width: 100% !important;
            max-width: 100% !important;
            height: 104px; /* 保持桌面端高度 */
          }
          
          /* 确保移动端弹窗内的item文字能够正确截断 */
          .mobile-project-item .menu-item h3,
          .mobile-project-item .menu-item p,
          .mobile-project-item .menu-item span {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .switcher-arrow {
          display: none; /* Hide arrows on mobile by default */
        }
        
        /* 项目切换菜单样式 */
        .project-menu-container {
          width: 432px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0);
          border-radius: 12px;
          box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.04), 0px 2px 6px 0px rgba(0, 0, 0, 0.04);
          padding: 16px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }
        
        .project-menu-scrollable {
          display: flex;
          flex-direction: column;
        }

        /* 语言切换菜单样式 - 与项目菜单保持一致 */
        .language-menu-container {
          width: 124px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0);
          border-radius: 12px;
          box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.04), 0px 2px 6px 0px rgba(0, 0, 0, 0.04);
          padding: 16px;
        }

        /* 移动端语言切换item适配 */
        .mobile-language-item {
          width: 100% !important;
          height: 48px !important;
          justify-content: center !important;
          padding: 12px 16px !important;
        }

        /* 语言切换项目样式 - 改为左对齐 */
        .language-item {
          height: 38px;
          width: 92px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: flex-start; /* 改为左对齐 */
          padding: 8px;
          font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          text-align: left; /* 改为左对齐 */
          transition: all 0.2s ease;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .language-item:first-child {
          margin-bottom: 4px; /* 添加4px间距 */
        }

        .language-item:not(.selected) {
          color: rgba(50, 51, 53, 0.85);
          font-weight: 400;
          line-height: 22px;
        }

        .language-item:hover {
          background: rgba(50, 51, 53, 0.06);
        }

        .language-item.selected {
          color: #477c4d;
          font-weight: 600;
          line-height: 20px;
        }

        /* --- Tablet and Desktop Styles --- */
        /* 最小481px时恢复桌面端布局 */
        @media (min-width: 481px) {
          .navigation-mask,
          .navigation-nav,
          .navigation-container {
            height: 100px; /* Desktop height */
          }

          .navigation-container {
            padding-left: 24px;
            padding-right: 24px;
            /* 在home按钮和右侧按钮组之间保持最小60px间距 */
            gap: 60px;
          }
          
          .nav-center {
            /* 确保中间区域不干扰最小间距 */
            min-width: 0;
          }

          .switcher-arrow {
            display: block; /* Show arrows on desktop */
          }
          
          .nav-right {
            gap: 60px; /* 项目切换和语言切换间距60px */
            flex-shrink: 0; /* 防止右侧组被压缩 */
          }
          
          /* 桌面端项目名称自适应 - 移除固定max-width限制，让文字在间距足够时完整显示 */
          .desktop-project-name {
            max-width: none; /* 移除固定限制，让容器自然决定宽度 */
          }
        }

        /* Stage 3: 640px 到 799px */
        @media (min-width: 640px) and (max-width: 799px) {
          .navigation-container {
            padding-left: 24px;
            padding-right: 24px;
          }
        }

        /* Stage 2: 800px 到 839px - 动态间距 */
        @media (min-width: 800px) and (max-width: 839px) {
          .navigation-container {
            padding-left: clamp(24px, (100vw - 800px) * 0.5625 + 24px, 60px);
            padding-right: clamp(24px, (100vw - 800px) * 0.5625 + 24px, 60px);
          }
        }

        /* Stage 1: 840px 及以上 - 60px 间距 */
        @media (min-width: 840px) {
          .navigation-container {
            padding-left: 60px;
            padding-right: 60px;
          }
        }

        /* 移动端底部弹窗body样式 */
        .mobile-bottom-sheet-body {
          /* 调整padding给描边留足空间 */
          padding-left: 18px !important;
          padding-right: 18px !important;
        }

        /* 自定义滚动条样式 */
        .project-menu-container::-webkit-scrollbar,
        .mobile-bottom-sheet-body::-webkit-scrollbar {
          width: 6px;
        }
        
        .project-menu-container::-webkit-scrollbar-track,
        .mobile-bottom-sheet-body::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .project-menu-container::-webkit-scrollbar-thumb,
        .mobile-bottom-sheet-body::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        
        .project-menu-container::-webkit-scrollbar-thumb:hover,
        .mobile-bottom-sheet-body::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </>
  );
}
