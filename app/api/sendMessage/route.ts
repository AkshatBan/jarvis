import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const responseString = "Sup";

    return NextResponse.json({responseString});
}