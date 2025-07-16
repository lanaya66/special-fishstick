import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import '../../src/i18n/i18n';
import NotionContent from '../../components/NotionContent';
import Navigation from '../../components/Navigation';

export default function ProjectDetail({ initialProject, initialProjects, initialSlug, initialLang }) {
  const router = useRouter();
  const { slug } = router.query;
  const { t, i18n } = useTranslation();

  const [project, setProject] = useState(initialProject);
  const [allProjects, setAllProjects] = useState(initialProjects || []);
  const [loading, setLoading] = useState(!initialProject);
  const [error, setError] = useState(null);

  // 中文注释: 初始化语言设置 - 优先使用URL参数，然后localStorage，最后默认en
  useEffect(() => {
    const urlLang = router.query.lang || initialLang;
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
  }, [router.isReady, router.query.lang, initialLang]);

  // 中文注释: 语言切换时重新获取数据
  useEffect(() => {
    // 中文注释: 只在语言实际变化且有有效slug时重新获取数据
    if (router.isReady && slug && i18n.language) {
      const currentUrlLang = router.query.lang;
      const actualLang = i18n.language;
      
      // 中文注释: 如果URL中的语言和当前i18n语言不一致，或者没有对应语言的项目数据，则重新获取
      if (currentUrlLang !== actualLang || !project || 
          (initialLang && initialLang !== actualLang && project)) {
        fetchProjectDetails(actualLang);
        fetchAllProjects(actualLang);
      }
    }
  }, [router.isReady, slug, i18n.language, router.query.lang]);

  const fetchProjectDetails = async (language = i18n.language) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/project/${slug}?lang=${language}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError(language === 'zh' ? '此项目的中文版本暂未同步' : 'English version of this project is not synced yet');
        } else {
          throw new Error('项目获取失败');
        }
        return;
      }
      
      const data = await response.json();
      setProject(data);
    } catch (err) {
      console.error('获取项目详情失败:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProjects = async (language = i18n.language) => {
    try {
      const response = await fetch(`/api/projects?lang=${language}`);
      const data = await response.json();
      if (data.success && Array.isArray(data.projects)) {
        setAllProjects(data.projects);
      }
    } catch (err) {
      console.error('获取项目列表失败:', err);
    }
  };



  // 中文注释: 获取下一个项目
  const getNextProject = () => {
    if (!allProjects.length || !project) return null;
    const currentIndex = allProjects.findIndex(p => p.slug === project.slug);
    return currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];
  };



  if (loading || !router.isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-red-600 mb-4">{error}</div>
          <Link 
            href={`/?lang=${i18n.language}`}
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={() => {
              localStorage.setItem('i18nextLng', i18n.language);
            }}
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600">项目未找到</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 中文注释: 页面标题设置 */}
      <Head>
        <title>Project Details - Lanaya Shi</title>
        <meta name="description" content="Product Design Project by Lanaya Shi" />
      </Head>
      
      {/* 中文注释: 统一导航栏 */}
      <Navigation 
        showProjectDropdown={true}
        currentProject={project}
        allProjects={allProjects}
      />

      {/* 中文注释: 主要内容区域 - 按照Figma设计布局，720px最大宽度，响应式间距 */}
      <main 
        className="mx-auto py-8"
        style={{
          width: '100%',  // 移除max-width限制
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'max(24px, calc((100vw - 720px) / 2))',
          paddingRight: 'max(24px, calc((100vw - 720px) / 2))',
          paddingTop: 'clamp(120px, 188px, 200px)', // 148px导航栏 + 40px间距，mobile下120px
          paddingBottom: '200px'  // 底部200px间距
        }}
      >
        
        {/* 中文注释: 项目标题区域 - 按设计图布局 */}
        <header className="mb-16">
          <h1 
            className="project-title text-3xl font-bold mb-6"
            style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {project.name}
          </h1>
          
          {/* 中文注释: 项目标签 - 水平排列，无年份，与标题间距24px */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {project.tags?.map((tag) => (
              <span 
                key={tag}
                className="project-tag"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>



        {/* 中文注释: Notion项目详细内容区域 - 严格按照Figma设计 */}
        <div className="mt-8">
          {project.hasDetailContent && project.content?.blocks ? (
            // 中文注释: 渲染从Notion同步的真实内容 - 这里是设计图中"(content from notion database project detail...)"的位置
            <div className="notion-content-container">
              <NotionContent blocks={project.content.blocks} />
            </div>
          ) : (
            // 中文注释: 如果没有详细内容，显示项目概览
            <div>
              <h2 
                className="text-2xl font-semibold text-gray-900 mb-6"
                style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                {i18n.language === 'zh' ? '项目概览' : 'Project Overview'}
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p 
                  className="text-gray-700 mb-4 leading-relaxed"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {i18n.language === 'zh' ? (
                    <>这是一个关于 <strong>{project.name}</strong> 的项目。</>
                  ) : (
                    <>This is a project about <strong>{project.name}</strong>.</>
                  )}
                </p>
                <p 
                  className="text-gray-600 text-sm mb-4"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {i18n.language === 'zh' 
                    ? '更多详细内容正在准备中，敬请期待...' 
                    : 'More detailed content is being prepared, stay tuned...'}
                </p>
                <div 
                  className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md p-3"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  <span className="mr-2">💡</span>
                  {i18n.language === 'zh'
                    ? '提示：管理员可通过同步页面获取Notion中的详细内容'
                    : 'Tip: Administrators can sync detailed content from Notion via the admin panel'}
                </div>
              </div>
            </div>
          )}
        </div>

      </main>

      <style jsx>{`
        /* 详情页标题样式 */
        .project-title {
          color: #323335;
          font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 36px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          letter-spacing: -0.72px;
        }
        
        /* 移动端响应式标题字号 */
        @media (max-width: 480px) {
          .project-title {
            font-size: 28px; /* 移动端项目大标题28px */
          }
        }

        /* 详情页标签样式 */
        .project-tag {
          color: #477C4D;
          background-color: transparent; /* 移除背景色 */
          border: none; /* 移除边框 */
          font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          font-style: italic;
          font-weight: 600;
          line-height: normal;
          padding: 0; /* 移除内边距 */
        }
        
        /* 正文内容样式覆盖 */
        :global(.notion-content-container p),
        :global(.notion-content-container li) {
          color: rgba(50, 51, 53, 0.85) !important; /* 正文色 */
          line-height: 26px !important; /* 增加行高 */
        }

        :global(.notion-content-container h1),
        :global(.notion-content-container h2),
        :global(.notion-content-container h3) {
          color: #323335 !important; /* 标题色 */
        }
      `}</style>
    </div>
  );
}

// 中文注释: 添加服务器端渲染支持 - 修复语言参数处理
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const { lang } = context.query;
  
  // 中文注释: 确定语言版本 - 优先使用查询参数，然后是cookie，最后默认en
  const language = lang || context.req.cookies.i18nextLng || 'en';
  
  try {
    // 中文注释: 构建API请求URL
    const protocol = context.req.headers['x-forwarded-proto'] || 'http';
    const host = context.req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    
    // 中文注释: 并行获取项目详情和项目列表
    const [projectResponse, projectsResponse] = await Promise.all([
      fetch(`${baseUrl}/api/project/${slug}?lang=${language}`),
      fetch(`${baseUrl}/api/projects?lang=${language}`)
    ]);
    
    if (!projectResponse.ok) {
      // 中文注释: 如果指定语言版本不存在，尝试获取另一种语言版本
      const fallbackLang = language === 'zh' ? 'en' : 'zh';
      const fallbackResponse = await fetch(`${baseUrl}/api/project/${slug}?lang=${fallbackLang}`);
      
      if (!fallbackResponse.ok) {
        return {
          notFound: true,
        };
      }
      
      // 中文注释: 重定向到存在的语言版本
      return {
        redirect: {
          destination: `/project/${slug}?lang=${fallbackLang}`,
          permanent: false,
        },
      };
    }
    
    const project = await projectResponse.json();
    const projectsData = await projectsResponse.json();
    const projects = projectsData.success ? projectsData.projects : [];
    
    return {
      props: {
        initialProject: project,
        initialProjects: projects,
        initialSlug: slug,
        initialLang: language,
      },
    };
  } catch (error) {
    console.error('SSR Error:', error);
    return {
      notFound: true,
    };
  }
} 