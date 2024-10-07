import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-white text-4xl mb-4">Welcome to your AI Assistant!</h1>
      <p className="mt-4 text-xl">This project is powered by Google's Gemini 1.5 Flash model. Please note that there is a limit to how many API calls this application can make.</p>
      <p className="mt-4 text-xl">Once on the main page, click the button to start talking to your AI Assistant. If you wish to stop the AI's during it's response, press the 'Escape' key. If you wish to end your conversation with the AI Assistant, say "Goodbye" in your prompt.</p>
      <Link href="/main">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go to Assistant</button>
      </Link>
    </main>
  );
}