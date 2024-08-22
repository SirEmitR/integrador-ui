import { NextResponse } from "next/server";
import CryptoJS from 'crypto-js';

export async function POST(req, res){
    const {message} = await req.json();
    const bytes = CryptoJS.AES.decrypt(message,  process.env.NEXT_PUBLIC_PASSWORD_SECRET);
    const result = bytes.toString(CryptoJS.enc.Utf8);
    return NextResponse.json({result: JSON.parse(result)});
}