import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // 确保导入的是大写的 App 组件
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container); // 创建一个 root
root.render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
