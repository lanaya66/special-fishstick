import React from 'react';
import ReactDOM from 'react-dom';
import HomeAiCoding from './HomeAiCoding'; // 中文注释: 引入主页组件
import './app/globals.css'; // 中文注释: 引入全局样式

//-------------- 渲染主页组件 --------------
ReactDOM.render(
  <React.StrictMode>
    <HomeAiCoding />
  </React.StrictMode>,
  document.getElementById('root') // 中文注释: 渲染到 root 节点
); 