import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

//-------------- 英文翻译资源 --------------
const resources = {
  en: {
    translation: {
      // 主要内容
      mainTitle: "Hi, I'm Lanaya Shi",
      about: "About",
      experience: "Experience",
      
      // About 段落
      aboutPara1: "Passionate about self-improvement, enthusiastic about critical thinking and debate, deeply drawn to artistic sensibilities, feminism, and the belief in fluidity. Once idolized geek culture and was a productivity enthusiast.",
      aboutPara2: "I'm now experiencing a slower pace of life, observing and rethinking humanity's pursuit of high-speed technology, the fast-paced society, and whether new technologies like AI are primarily addressing the issues of highly skilled individuals, continuing to create wealth for the economic elite, and falling short in assisting ordinary people. I also ponder the potential for technology to reduce class solidification and narrow the wealth gap in the future.",
      aboutPara3: "My core profession is product design for internet products. I love music, especially Jazz hip-hop, Nujabes, FKJ.",
      aboutPara4: "I love nature, especially walking in the beautiful nature like JiuzhaiGou and Iceland, which I just traveled a few day's ago. I very like to thinking and reading, listening podcasts, especially about philosophy, thinking, social science.",
      
      // 工作经历
      zoomDescription: "Job description 1\nLed AI-powered features design for collaborative tools, improving user productivity by 40%. Designed intuitive document editing interfaces and collaborative workflows for global enterprise clients.",
      shimoDescription: "Job description 2\nDesigned comprehensive collaboration platform serving 10M+ users. Created unified design system and optimized workflows for document editing, project management, and team collaboration.",
      seiueDescription: "Job description 3\nDeveloped innovative GTD (Getting Things Done) features and all-in-one collaboration solutions. Focused on user experience design for productivity tools and workflow optimization.",
      actionPeriod: "时间",
      actionTags: "标签", 
      actionDescription: "Job description 4\nWorked on action-oriented design solutions and user interface optimization. Specialized in creating efficient user flows and improving overall user experience.",
      
      // Project Detail 入口
      projectEntranceText: "View the Project Portfolio 👇🏼",
      passwordPlaceholder: "Password",
      submitButton: "Submit",
      passwordError: "Incorrect password.",
      passwordSuccessText: "Done! Check out the new page! 🙌🏼",
      passwordHint: "Contact me for password or find clues in my portfolio",
      contactInfo: "WeChat: lanaya2024 | Email: lanaya@example.com",
      modalTitle: "Access Portfolio with Password",
      
      // 密码提示信息 - 严格按照设计稿
      passwordHint1: "No password? Get in touch:",
      wechatContact: "Wechat: s_wenxin",
      emailContact: "Email: lanayaswx@outlook.com"
    }
  },
  zh: {
    translation: {
      // 主要内容 - 保持英文原文
      mainTitle: "Hi, I'm Lanaya Shi",
      about: "About",
      experience: "Experience",
      
      // About 段落
      aboutPara1: "热衷于自我提升，喜欢批判性思维和辩论，深深被艺术感性、女性主义和流动性信念所吸引。曾经崇拜极客文化，是一个效率爱好者。",
      aboutPara2: "我现在正在体验更慢的生活节奏，观察和反思人类对高速技术的追求、快节奏社会，以及像AI这样的新技术是否主要解决高技能人才的问题，继续为经济精英创造财富，而在帮助普通人方面做得不够。我也在思考技术在未来减少阶层固化和缩小贫富差距的潜力。",
      aboutPara3: "我的核心职业是互联网产品的产品设计。我喜欢音乐，特别是爵士嘻哈、Nujabes、FKJ。",
      aboutPara4: "我热爱自然，特别喜欢在九寨沟和冰岛这样的美丽自然环境中漫步，我几天前刚刚去过那里旅行。我非常喜欢思考和阅读，听播客，特别是关于哲学、思维、社会科学的内容。",
      
      // 工作经历
      zoomDescription: "工作描述 1\n负责AI驱动的协作工具功能设计，将用户生产力提高了40%。为全球企业客户设计直观的文档编辑界面和协作工作流程。",
      shimoDescription: "工作描述 2\n设计服务1000万+用户的综合协作平台。创建统一的设计系统，优化文档编辑、项目管理和团队协作的工作流程。",
      seiueDescription: "工作描述 3\n开发创新的GTD（Getting Things Done）功能和一体化协作解决方案。专注于生产力工具的用户体验设计和工作流程优化。", 
      actionPeriod: "2020.06 - 2021.10",
      actionTags: "产品设计, 用户体验",
      actionDescription: "工作描述 4\n从事面向行动的设计解决方案和用户界面优化工作。专注于创建高效的用户流程和改善整体用户体验。",
      
      // Project Detail 入口 - 修改文案
      projectEntranceText: "View the Project Portfolio 👇🏼",
      passwordPlaceholder: "Password",
      submitButton: "提交",
      passwordError: "密码错误",
      passwordSuccessText: "密码输入正确，新页面已打开 🙌🏼",
      passwordHint: "联系我获取密码或在我的作品集中寻找线索",
      contactInfo: "微信: lanaya2024 | 邮箱: lanaya@example.com",
      modalTitle: "输入密码查看完整作品集",
      
      // 密码提示信息 - 严格按照设计稿
      passwordHint1: "没有密码？请联系我：",
      wechatContact: "Wechat：s_wenxin",
      emailContact: "Email：lanayaswx@outlook.com"
    }
  }
};

//-------------- i18n 配置 --------------
i18n
  .use(initReactI18next) // 中文注释: 初始化react-i18next
  .init({
    resources,
    lng: 'en', // 中文注释: 默认语言设为英文
    fallbackLng: 'en',
    
    keySeparator: false, // 中文注释: 不使用键分隔符

    interpolation: {
      escapeValue: false, // 中文注释: React已经默认转义了
    },
  });

export default i18n; 