import { useState, useEffect } from 'react';
import Head from 'next/head';

//-------------- 管理员同步页面 --------------

export default function AdminSync() {
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [contentSyncLoading, setContentSyncLoading] = useState(false);

  /**
   * 验证密码
   */
  const handleAuth = () => {
    if (password === 'uuuuu') {
      setIsAuthed(true);
      setMessage('认证成功！');
      setMessageType('success');
      loadProjects(); // 认证成功后加载项目列表
    } else {
      setMessage('密码错误');
      setMessageType('error');
    }
  };

  /**
   * 加载项目列表
   */
  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects?lang=zh');
      const data = await response.json();
      // 中文注释: 从API响应中提取projects数组
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('加载项目列表失败:', error);
      // 中文注释: 发生错误时设置为空数组
      setProjects([]);
    }
  };

  /**
   * 同步内容
   * @param {string} language - 语言版本
   */
  const handleSync = async (language) => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/sync-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'uuuuu',
          language
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`${data.message} - 同步了 ${data.count} 个项目`);
        setMessageType('success');
        // 中文注释: 同步成功后重新加载项目列表
        await loadProjects();
      } else {
        setMessage(data.error || '同步失败');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('同步过程中出现错误: ' + error.message);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 同步所有语言版本
   */
  const handleSyncAll = async () => {
    setIsLoading(true);
    setMessage('开始同步所有语言版本...');
    setMessageType('');

    try {
      // 中文注释: 依次同步中文和英文版本
      await handleSync('zh');
      await new Promise(resolve => setTimeout(resolve, 1000)); // 中文注释: 间隔1秒
      await handleSync('en');
      
      setMessage('所有语言版本同步完成！');
      setMessageType('success');
      loadProjects(); // 重新加载项目列表
    } catch (error) {
      setMessage('批量同步失败: ' + error.message);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 同步单个项目的详细内容
   */
  const handleSyncProjectContent = async (language) => {
    if (!selectedProject) {
      setMessage('请先选择一个项目');
      setMessageType('error');
      return;
    }

    setContentSyncLoading(true);
    setMessage(`开始同步项目详细内容: ${selectedProject} (${language})...`);
    setMessageType('');

    try {
      const response = await fetch('/api/sync-project-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'uuuuu',
          projectId: selectedProject,
          language
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`项目内容同步成功！项目ID: ${data.projectId}, 语言: ${data.language}`);
        setMessageType('success');
      } else {
        setMessage(data.error || '项目内容同步失败');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('同步过程中出现错误: ' + error.message);
      setMessageType('error');
    } finally {
      setContentSyncLoading(false);
    }
  };

  if (!isAuthed) {
    return (
      <>
        <Head>
          <title>管理员面板 - 内容同步</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-center mb-6">管理员认证</h1>
            
            <div className="space-y-4">
              <input
                type="password"
                placeholder="请输入管理员密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              />
              
              <button
                onClick={handleAuth}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                登录
              </button>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-md text-sm ${
                messageType === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>管理员面板 - 内容同步</title>
      </Head>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-center mb-8">内容同步管理</h1>
            
            {/* 中文注释: 项目基本信息同步区域 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">📋 项目基本信息同步</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* 中文注释: 中文版本同步 */}
              <button
                onClick={() => handleSync('zh')}
                disabled={isLoading}
                className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? '同步中...' : '同步中文版本'}
              </button>

              {/* 中文注释: 英文版本同步 */}
              <button
                onClick={() => handleSync('en')}
                disabled={isLoading}
                className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? '同步中...' : '同步英文版本'}
              </button>

              {/* 中文注释: 全部同步 */}
              <button
                onClick={handleSyncAll}
                disabled={isLoading}
                className="bg-purple-500 text-white py-3 px-6 rounded-md hover:bg-purple-600 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? '同步中...' : '同步全部版本'}
              </button>
            </div>
            </div>

            {/* 中文注释: 项目详细内容同步区域 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">📝 项目详细内容同步</h2>
              
              <div className="space-y-4">
                {/* 中文注释: 项目选择 */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">选择项目...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} ({project.year})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 中文注释: 内容同步按钮 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSyncProjectContent('zh')}
                    disabled={contentSyncLoading || !selectedProject}
                    className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 disabled:bg-gray-400 transition-colors"
                  >
                    {contentSyncLoading ? '同步中...' : '同步中文详细内容'}
                  </button>

                  <button
                    onClick={() => handleSyncProjectContent('en')}
                    disabled={contentSyncLoading || !selectedProject}
                    className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 disabled:bg-gray-400 transition-colors"
                  >
                    {contentSyncLoading ? '同步中...' : '同步英文详细内容'}
                  </button>
                </div>
              </div>
            </div>

            {/* 中文注释: 消息显示区域 */}
            {message && (
              <div className={`p-4 rounded-md text-sm ${
                messageType === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {message}
              </div>
            )}

            {/* 中文注释: 使用说明 */}
            <div className="mt-8 p-4 bg-gray-100 rounded-md">
              <h3 className="font-semibold mb-2">使用说明：</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <strong>项目基本信息同步：</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• 同步项目列表、标题、标签、年份等基本信息</li>
                    <li>• 使用预定义的固定图片，不会下载Notion中的图片</li>
                    <li>• 同步完成后网站首页将显示最新的项目列表</li>
                  </ul>
                </div>
                <div>
                  <strong>项目详细内容同步：</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• 同步Notion页面的详细内容（文本、图片、列表等）</li>
                    <li>• 需要先选择要同步的项目，然后选择语言版本</li>
                    <li>• 同步后项目详情页面将显示完整的Notion内容</li>
                    <li>• 内容中的图片会自动下载到本地</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 中文注释: 返回首页链接 */}
            <div className="mt-6 text-center">
              <a 
                href="/"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                返回首页
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 