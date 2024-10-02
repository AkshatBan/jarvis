import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { prompt } = await req.json();
        const result = await model.generateContent(prompt);

        return NextResponse.json({ responseString: result.response.text() });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong', message: (error as Error).message }, { status: 500 });
    }
}