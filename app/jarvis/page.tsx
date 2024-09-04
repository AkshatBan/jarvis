"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
    const [message, setMessage] = useState<string>("Loading...");
    async function getMessage() {
        const response = await fetch("/api/sendMessage");
        const data = await response.json()
        setMessage(data.responseString)
        return response;
    }
    useEffect(() => {
        const response = getMessage();
    })
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {message}
    </main>

  );
}
