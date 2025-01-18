"use client";

// Page.tsx
import React from 'react';
import QrCodeReader from '@/components/QrCodeReader';  // インポートパスを確認してください

const Page: React.FC = () => {
  // スキャン成功時の処理
  const handleScanSuccess = (scanData: string) => {
    console.log('スキャン成功:', scanData);
  
    // スキャンしたデータがURLであれば、そのURLにリダイレクト
    try {
      const url = new URL(scanData);  // URLとして解析できるか試す
      window.location.href = url.toString();  // URLに遷移
    } catch (e) {
      console.error('スキャンしたデータがURLではありません:', scanData);
    }
  };
  

  // スキャン失敗時の処理
  const handleScanFailure = (error: Error) => {
    // エラーメッセージをログに出力するが、エラーとしては扱わない
    console.warn('スキャン失敗:', error.message);  // console.errorではなくconsole.warnで警告として出力
  };


  return (
    <>
      <h1>QRコードリーダー</h1>
      {/* QRCodeReader コンポーネントに必要なプロパティを渡す */}
      <QrCodeReader
        onScanSuccess={handleScanSuccess}
        onScanFailure={(error: string) => {
          // ここで文字列として処理
          console.warn('スキャン失敗:', error);
        }}
      />
    </>
  );
};

export default Page;

