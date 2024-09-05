// Imports
import { NextRequest, NextResponse } from "next/server";

// Handling of POST requests
export async function POST(request: NextRequest) {
    const { expression } = await request.json();

    try {
        const result = eval(expression);
        return NextResponse.json({ result });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid expression' }, { status: 400 });
    }
}