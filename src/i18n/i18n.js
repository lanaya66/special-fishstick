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
      projects: "Projects",
      
      // About 段落
      aboutPara1: "Product design is not just my profession but also a significant way I experience focus.",
      aboutPara2: "In my past work, I've sought elegant solutions within complex systems, balancing clarity and familiarity with simplicity and efficiency in highly detailed tools, aiming to reduce friction for individual workers in an era of information dispersion.",
      aboutPara3: "I used to be a productivity enthusiast, drawn to various automation technologies and products that enhance efficiency and cut unnecessary time waste. In recent years, my AI product work has focused more on issues like \"effortless automation versus human control\" and \"traditional interfaces versus new interaction languages.\"",
      aboutPara4: "I have a passion for nature, share my home with two cats, and occasionally indulge in reading and podcasts during my leisure time.",
      aboutPara5: "Music is another joy; I enjoy Jazz hip-hop, City Pop, and artists like Nujabes, FKJ, and Honne.",
      aboutPara6: "After a long period of intense work leading to the launch of my previous product, I decided to take a break from years of busyness to rediscover the observation of everyday life. Over the past few months, I've gone hiking in places I've always wanted to visit, practiced dancing to express myself in diverse ways, and started learning programming to enhance my ability to bring ideas to life and increase certainty in Vibe coding.",
            
      // 工作经历
      zoomDescription: "Design Lead for the 'Page Editor + AI' Suite in <a href=\"https://www.zoom.com/en/products/collaborative-docs/\" target=\"_blank\" style=\"color: inherit; text-decoration: underline;\">Zoom Docs</a>\n\nI spearheaded the overall interaction framework design for a document editor, leading AI-driven scenario design, team design and review processes, and organizing workshops. I also orchestrated the design material arrangements for the Zoom Docs segment in two <a href=\"https://www.youtube.com/watch?v=CuHOo6bLEic\" target=\"_blank\" style=\"color: inherit; text-decoration: underline;\">Zoomtopia</a> product launches.",
      shimoDescription: "Product Designer\n\nI managed the design of the main website for <a href=\"https://shimo.im/\" target=\"_blank\" style=\"color: inherit; text-decoration: underline;\">Shimo Docs</a> and the innovative overseas project <a href=\"https://www.producthunt.com/products/light-6\" target=\"_blank\" style=\"color: inherit; text-decoration: underline;\">Light</a>, covering its overall interaction framework, Wiki knowledge management, personal productivity scenarios (GTD), and team management.",
      seiueDescription: "Head of Design, Product Designer\n\nFor <a href=\"https://www.seiue.com/\" target=\"_blank\" style=\"color: inherit; text-decoration: underline;\">Chalk 3.0</a>, an innovative campus management product serving prestigious schools like Peking University High School and Tsinghua University High School, I built the interaction framework for both web and app, designed personal efficiency tools, explored and innovated in core educational scenarios, designed middle-tier engine functionalities, developed a new design system using Design Tokens, and oversaw design management.",
      actionDescription: "Product Designer\n\nI independently handled the interaction design, design system development, and some product prototyping for the video appreciation and booking platform \"Action 一直拍\" on both web and app. I also contributed creative ideas for event operations.",
      
      // 项目相关
      projectsCount: "{{count}} projects in total",
      noProjects: "No projects available",
      loadingProjects: "Loading projects...",
      projectLoadError: "Failed to load projects",
      retry: "Retry"
    }
  },
  zh: {
    translation: {
      // 主要内容 - 保持英文原文
      mainTitle: "Hi, I'm Lanaya Shi",
      about: "About",
      experience: "Experience",
      projects: "Projects",
      
      // About 段落
      aboutPara1: "产品设计是我的工作，也是我感受专注的重要方式之一。",
      aboutPara2: "在过去的工作中，我从复杂系统中寻找优雅解法，在高度细节化的工具中平衡着清晰熟悉与简洁高效，为信息分散时代的个体工作者寻找减少摩擦的可能性。",
      aboutPara3: "我曾是生产力控，喜欢各类能提升效率、减少不必要时间消耗的自动化技术与产品。在近几年的 AI 产品工作中，我更多专注在「自动化的不费力与人的控制权」和「传统界面与新的交互语言」等问题上。",
      aboutPara4: "我热爱自然，养了两只猫咪，闲时偶尔阅读，听播客。",
      aboutPara5: "享受音乐，Jazz hip-hop、City Pop，Nujabes，FKJ，Honne。",
      aboutPara6: "在忙碌了很久的上一个产品上线后，我决定从连续多年的繁忙中休息片刻，找回对平凡生活的观察。在过去几个月，我去了一直想去的地方徒步；练习舞蹈，用多元方式表达自我；学习编程入门，提升想法落地的能力，增加在与 AI 协作中的确定性。",
      
      // 工作经历
      zoomDescription: "<a href=\"https://www.zoom.com/en/products/collaborative-docs/\" target=\"_blank\" style=\"color: inherit; text-decoration: underline;\">Zoom Docs</a>  Page Editor + AI 组产品设计师，设计组长\n\n负责文档编辑器的整体交互框架设计，主导 AI-driven 场景设计，团队设计与审核流程，组织 Workshop，主导了两次 <a href=\"https://www.youtube.com/watch?v=CuHOo6bLEic\" target=\"_blank\" style=\"color: inherit; text-decoration: underline;\">Zoomtopia</a> 发布会中 Zoom Docs 场景的设计素材工作安排。",
      shimoDescription: "产品设计师\n\n负责<a href=\"https://shimo.im/\" target=\"_blank\" style=\"color: inherit; text-decoration: underline;\">石墨文档</a>主站设计，All-In-One 出海创新项目 <a href=\"https://www.producthunt.com/products/light-6\" target=\"_blank\" style=\"color: inherit; text-decoration: underline;\">Light</a> 主站的设计，包括 Light 整体交互框架，Wiki 知识管理场景，个人生产力场景 GTD 的探索与创新，以及团队管理场景。",
      seiueDescription: "产品设计师，设计负责人\n\n<a href=\"https://www.seiue.com/\" target=\"_blank\" style=\"color: inherit; text-decoration: underline;\">Chalk 3.0</a> 是全场景覆盖的创新型校园管理产品，深度服务北大附中、清华附中、北京四中、王府学校、广州中学、深圳中学等优质创新校。我负责产品 Web、App 端的交互框架搭建，个人效率工具的设计，核心教育场景的全链路产品设计与创新探索，中台引擎功能的设计，基于 Design Token 构建新的设计系统，以及设计管理工作。",

      actionDescription: "产品设计师\n\n独立负责视频欣赏与约片平台「Action 一直拍」Web 与 APP 端产品的交互设计，部分产品原型工作，设计系统建设，同时为运营活动提供创意灵感。",
      
      // 项目相关
      projectsCount: "共 {{count}} 个项目",
      noProjects: "暂无项目数据",
      loadingProjects: "加载项目中...",
      projectLoadError: "加载项目数据失败",
      retry: "重试"
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