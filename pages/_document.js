import { Html, Head, Main, NextScript } from 'next/document'

//-------------- 自定义文档组件 --------------
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 中文注释: 网站 favicon 设置 */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        
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