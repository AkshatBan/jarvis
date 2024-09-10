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

    const [transcript, setTranscript] = useState('');
    const startListening = () => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Browser does not support speech-to-text");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        console.log('Transcript:', speechResult);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error thrown');
      };

      recognition.start();
    };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {message}
      <h1 className="text-white text-4xl mb-4">Welcome! Feel free to ask me questions!</h1>
      <div className="w-auto h-auto">
        <button onClick={(startListening)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Speech-to-text
        </button>
        <p className="mt-4 text-xl">{transcript || 'Waiting for speech...'}</p>
      </div>
      <Link href='/calculator'>
        Calculator
      </Link>
    </main>

  );
}
