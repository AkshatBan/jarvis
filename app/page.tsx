"use client"
import Image from "next/image";
import Link from "next/link";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useState } from "react";

export default function Home() {
    const [transcript, setTranscript] = useState('');
    const [message, setMessage] = useState<string>("Loading...");
    const [micActive, setMicActive] = useState(false);

    // Get message from user (speech-to-text)
    const startListening = () => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Browser does not support speech-to-text");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = true;

      recognition.onstart = (event: any) => {
        setMicActive(true);
        console.log("Microphone is Active");
      }

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const speechResult = event.results[i][0].transcript;
            fullTranscript += speechResult;
            setTranscript(fullTranscript.trim());
            console.log('Transcript:', speechResult);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error thrown');
      };

      recognition.onspeechend = (event: any) => {
        setMicActive(false)
        recognition.stop();
        console.log('Speech recognition has ended.');
      }

      recognition.start();
    };

    useEffect(() => {
      if (transcript && !micActive) {
        getMessage(transcript);
      }
    }, [transcript]);
    
    // Code for sending user's transcript to AI model
    const getMessage = async (userTranscript: string) => {
      try {
        const response = await fetch('api/getMessage', {
          method: "POST",
          headers: {
            'Content_Type': 'application/json',
          },
          body: JSON.stringify({ prompt:userTranscript + "Please do not add any emojis or special characters in your response." })
        });
        const data = await response.json();
        setMessage(data.responseString);
        startSpeaking(data.responseString);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    // Give user message from AI model (text-to-speech)
    const startSpeaking = (aiResponse: string) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      } else {
        alert('Text-to-speech not supported in this browser');
      }
    };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-white text-4xl mb-4">Welcome! Feel free to ask me questions!</h1>
      <div className="w-auto h-auto">
        <button onClick={(startListening)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Ask question
        </button>
        <p className="mt-4 text-xl">{transcript || 'Waiting for speech...'}</p>
        <p className="mt-4 text-xl">{message}</p>
      </div>
    </main>

  );
}
