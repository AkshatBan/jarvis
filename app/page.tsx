"use client"
import Image from "next/image";
import Link from "next/link";
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
      <h1 className="text-white text-4xl mb-4">Welcome! Feel free to ask me questions!</h1>
      <div className="w-auto h-auto">
        <Image
          src="/images/iron-man-jarvis-desktop-353i9mfou5bdnzum.jpg"
          alt="AI Avatar"
          width={500}
          height={500}
          className="rounded-full"
        />
      </div>
      <Link href='/calculator'>
        Calculator
      </Link>
    </main>

  );
}
