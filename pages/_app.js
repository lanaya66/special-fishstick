import '../styles/globals.css'
import '../src/i18n/i18n'

//-------------- 全局应用组件 --------------
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
} 