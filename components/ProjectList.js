import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectCard from './ProjectCard';
import { sortProjectsByOrder } from '../lib/project-images';

//-------------- 项目列表组件 --------------

/**
 * 项目列表组件
 * 从API获取项目数据并显示为网格布局
 */
export default function ProjectList() {
  const { i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 获取项目数据
   */
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // 中文注释: 根据当前语言获取对应的项目数据
      const language = i18n.language || 'zh';
      const response = await fetch(`/api/projects?lang=${language}`);
      
      if (!response.ok) {
        throw new Error('获取项目数据失败');
      }

      const data = await response.json();
      
      if (data.success) {
        // 中文注释: 对项目进行排序，确保按照预定义顺序显示
        const sortedProjects = sortProjectsByOrder(data.projects || []);
        setProjects(sortedProjects);
      } else {
        throw new Error(data.error || '获取项目数据失败');
      }
    } catch (err) {
      console.error('获取项目数据失败:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 中文注释: 组件挂载时和语言切换时获取数据
  useEffect(() => {
    fetchProjects();
  }, [i18n.language]);

  // 中文注释: 加载状态
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-6">
          {/* 中文注释: 显示骨架屏效果 - 响应式尺寸 */}
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="relative animate-pulse bg-[rgba(107,140,110,0.06)] rounded-2xl p-[24px] w-full min-h-[208px]">
              {/* 中文注释: 模拟白色边框 */}
              <div className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-[18px]" />
              
              {/* 中文注释: 横向布局骨架 */}
              <div className="flex flex-row gap-6 items-start">
                {/* 中文注释: 图片区域骨架 */}
                <div className="flex-none">
                  <div className="bg-gray-200 rounded-xl w-[240px] h-[160px]"></div>
                </div>
                
                {/* 中文注释: 文字区域骨架 */}
                <div className="flex flex-col justify-between flex-1 min-h-[160px]">
                  <div className="flex flex-col gap-4">
                    <div className="h-[24px] bg-gray-200 rounded w-3/4"></div>
                    <div className="h-[16px] bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-[16px] bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 中文注释: 错误状态
  if (error) {
    return (
      <div className="w-full text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">加载项目数据失败</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
        <button
          onClick={fetchProjects}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  // 中文注释: 无项目数据
  if (projects.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <div className="text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg font-medium">暂无项目数据</p>
          <p className="text-sm mt-2">请先同步项目内容</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 中文注释: 项目布局 - 垂直排列，确保各种屏幕下的一致性 */}
      <div className="flex flex-col gap-6">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id || index}
            project={project} 
          />
        ))}
      </div>


    </div>
  );
} 