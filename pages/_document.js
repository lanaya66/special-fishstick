import { Html, Head, Main, NextScript } from 'next/document'

//-------------- 自定义文档组件 --------------
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 中文注释: 网站 favicon 设置 - 支持多种尺寸和格式 */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        
        {/* 中文注释: 页面元数据 */}
        <meta name="theme-color" content="#323335" />
        <meta name="msapplication-TileColor" content="#323335" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 