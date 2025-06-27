import { Html, Head, Main, NextScript } from 'next/document'

//-------------- 自定义文档组件 --------------
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 中文注释: 添加字体和元数据 */}
        <link
          href="https://fonts.googleapis.com/css2?family=SF+Pro+Text:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="description" content="Lanaya Shi - Product Designer Portfolio" />
        <meta name="keywords" content="product design, UX design, UI design, portfolio" />
        <meta name="author" content="Lanaya Shi" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 