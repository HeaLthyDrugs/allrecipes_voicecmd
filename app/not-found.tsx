'use client';

import Link from 'next/link';
import NavBar from './components/NavBar';
import MicrophoneButton from './components/MicrophoneButton';
import VoiceCommandsHelp from './components/VoiceCommandsHelp';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      
      {/* Spacer to account for fixed navbar */}
      <div className="h-16"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-[#4A4A4A] mb-6">
          Recipe Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          We couldn't find the recipe you're looking for.
        </p>
        <Link 
          href="/"
          className="bg-[#F5A623] hover:bg-[#e09215] text-white font-medium px-8 py-3 rounded-full transition-colors inline-block"
        >
          Back to Home
        </Link>
        <p className="mt-8 text-gray-500 italic">
          You can also say <strong>"Go to homepage"</strong> to navigate back
        </p>
      </div>
      
      <MicrophoneButton />
      <VoiceCommandsHelp />
    </main>
  );
} 