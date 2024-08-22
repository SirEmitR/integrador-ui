import CryptoJS from 'crypto-js';
import { NextResponse } from 'next/server';
export async function POST(req, res){
    const {type, data} = await req.json();
    if(type === 'chunk'){
        const base64Chunk = Buffer.from(data).toString('base64');
        const ciphertext = CryptoJS.AES.encrypt(base64Chunk, process.env.NEXT_PUBLIC_PASSWORD_SECRET).toString();
        return NextResponse.json({result: ciphertext});
    }else{
        const ciphertext = CryptoJS.AES.encrypt(data, process.env.NEXT_PUBLIC_PASSWORD_SECRET).toString();
        return NextResponse.json({result: ciphertext});
    }
}