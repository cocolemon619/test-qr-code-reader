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
      // window.location.href = url.toString();  // URLに遷移
  
      // APIへPOSTリクエストを送信
      fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // 正しいContent-Typeを指定
        },
        body: JSON.stringify({ url: scanData }),  // URLをJSONとして送信
      })
        .then(response => response.json())
        .then(data => console.log('APIからのレスポンス:', data))
        .catch(error => console.error('APIリクエストエラー:', error));
    } catch {
      console.error('スキャンしたデータがURLではありません:', scanData);
    }
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

