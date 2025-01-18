// app/api/log/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // リクエストボディをJSONとしてパース
        const { url } = await request.json();
        console.log('受信したURL:', url);

        // レスポンスを返す
        return NextResponse.json({ message: 'URLを受信しました' });
    } catch (error) {
        console.error('データのパース中にエラーが発生しました:', error);
        return NextResponse.json({ error: 'データのパース中にエラーが発生しました' }, { status: 400 });
    }
}
