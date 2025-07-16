import React from 'react';
import Head from 'next/head';
import LoadingAnimation from '../components/LoadingAnimation';

/**
 * Loading动画演示页面
 */
export default function LoadingDemo() {
  return (
    <>
      <Head>
        <title>Loading Animation Demo - Lanaya Shi</title>
        <meta name="description" content="Loading animation demonstration" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Loading Animation Demo
          </h1>
          
          <LoadingAnimation />
          
          <p className="text-center text-gray-600 mt-8">
            堆叠图片轮换效果演示
          </p>
        </div>
      </div>
    </>
  );
} 