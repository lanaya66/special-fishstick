import React from 'react';
import Head from 'next/head'; // 中文注释: 引入Next.js Head组件用于设置页面标题
import '../src/i18n/i18n'; // 中文注释: 引入国际化配置
import HomeAiCoding from '../src/HomeAiCoding'; // 中文注释: 引入主页组件

//-------------- 主页页面 --------------
export default function HomePage() {
  return (
    <>
      <Head>
        <title>Hi, I'm Lanaya Shi</title>
        <meta name="description" content="Product Designer focused on elegant solutions within complex systems, balancing clarity and efficiency." />
      </Head>
      <HomeAiCoding />
    </>
  ); // 中文注释: 渲染主页组件
} 