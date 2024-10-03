"use client"
import Image from "next/image";
import Link from "next/link";
import { handleClientScriptLoad } from "next/script";
import { useEffect, useState, useRef } from "react";

export default function Home() {
    const [transcript, setTranscript] = useState('');
    const [message, setMessage] = useState<string>("Loading...");
    const recognition = useRef<any>(null);

    // Get message from user (speech-to-text)
    const startListening = () => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Browser does not support speech-to-text");
        return;
      }

      recognition.current = new SpeechRecognition();
      recognition.current.lang = 'en-US';
      recognition.current.interimResults = false;
      recognition.current.continuous = true;

      recognition.current.onstart = (event: any) => {
        console.log("Microphone is Active");
      }

      recognition.current.onresult = (event: any) => {
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

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error thrown');
      };

      recognition.current.onspeechend = (event: any) => {
        recognition.current.stop();
        console.log('Speech recognition has ended.');
      }

      recognition.current.start();
    };

    useEffect(() => {
      if (transcript) {
        if (recognition.current){
          recognition.current.stop();
          console.log('Speech recognition has ended.');
        }
        getMessage(transcript);
        startListening();
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
        if (userTranscript.toLowerCase() !== "goodbye"){
          startSpeaking(data.responseString);
        }
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    // Give user message from AI model (text-to-speech)
    const startSpeaking = (aiResponse: string) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.lang = 'en-US';

        utterance.onend = () => {
          console.log("Speech done. Restarting microphone...");
          startListening();
        }

        window.speechSynthesis.speak(utterance);
      } else {
        alert('Text-to-speech not supported in this browser');
      }
    };

    // Keyboard interrupt to stop text to speech
    const stopSpeaking = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        console.log('Speech manually cancelled.')
      } else {
        alert("Text-to-speech not supported in this browser");
      }
    };

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          stopSpeaking();
        }
      }
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-white text-4xl mb-4">Welcome! Feel free to ask me questions!</h1>
      <button onClick={(startListening)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Ask question
      </button>
      <p className="mt-4 text-xl">Your prompt: {transcript || 'Waiting for speech...'}</p>
      <p className="mt-4 text-xl">Google Gemini's Response: {message}</p>
    </main>

  );
}
